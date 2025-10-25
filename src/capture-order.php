<?php
// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/paypal_errors.log');

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/util.php';

// CORS headers
header('Access-Control-Allow-Origin: https://photography.christian-boehme.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

error_log("capture-order.php: Script started");

// Load secrets
$secretFile = __DIR__ . '/paypal-secret.php';
if (!file_exists($secretFile)) { $secretFile = dirname(__DIR__) . '/paypal-secret.php'; }
if (!file_exists($secretFile)) { http_response_code(500); header('Content-Type: application/json'); echo json_encode(['error' => 'Server not configured: paypal-secret.php missing']); exit; }
require_once $secretFile;

$base = (defined('PAYPAL_ENV') && PAYPAL_ENV === 'sandbox') ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

// OAuth token
$ch = curl_init("$base/v1/oauth2/token");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [ 'Content-Type: application/x-www-form-urlencoded', 'Accept: application/json' ],
  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
  CURLOPT_USERPWD => trim(PAYPAL_CLIENT_ID) . ':' . trim(PAYPAL_SECRET),
  CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'client_credentials'])
]);
$tokenRes = curl_exec($ch);
$tokenInfo = json_decode($tokenRes, true);
curl_close($ch);
if (!isset($tokenInfo['access_token'])) { http_response_code(502); header('Content-Type: application/json'); echo json_encode(['error' => 'OAuth token missing']); exit; }
$accessToken = $tokenInfo['access_token'];

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$orderID = $input['orderID'] ?? null;
if (!$orderID) { http_response_code(400); header('Content-Type: application/json'); echo json_encode(['error' => 'orderID is required']); exit; }

// Capture
$ch2 = curl_init("$base/v2/checkout/orders/" . urlencode($orderID) . "/capture");
curl_setopt_array($ch2, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [ 'Content-Type: application/json', 'Authorization: Bearer ' . $accessToken ]
]);
$capRes = curl_exec($ch2);
$httpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

$cap = json_decode($capRes ?: 'null', true);
// Persist order
try {
  $pdo = db_conn();
  $pdo->beginTransaction();
  $payerEmail = $cap['payer']['email_address'] ?? null;
  $user = $payerEmail ? db_get_or_create_user($payerEmail) : null;
  $stmt = $pdo->prepare('INSERT INTO orders(user_id, paypal_order_id, paypal_capture_id, amount, currency, status, created_at) VALUES(?,?,?,?,?,?,?)');
  $amount = $cap['purchase_units'][0]['payments']['captures'][0]['amount']['value'] ?? null;
  $currency = $cap['purchase_units'][0]['payments']['captures'][0]['amount']['currency_code'] ?? null;
  $status = $cap['status'] ?? null;
  $captureId = $cap['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;
  $stmt->execute([
    $user ? (int)$user['id'] : null,
    $orderID,
    $captureId,
    $amount,
    $currency,
    $status,
    time()
  ]);
  $orderDbId = (int)$pdo->lastInsertId();
  // Items
  $desc = $cap['purchase_units'][0]['description'] ?? ($cap['purchase_units'][0]['payments']['captures'][0]['custom_id'] ?? 'Photo');
  $customId = $cap['purchase_units'][0]['custom_id'] ?? ($cap['purchase_units'][0]['payments']['captures'][0]['custom_id'] ?? null);
  if ($customId) {
    $pdo->prepare('INSERT INTO order_items(order_id, src, description, price) VALUES(?,?,?,?)')->execute([$orderDbId, $customId, $desc, $amount]);
  }
  $pdo->commit();
  // Send confirmation email with magic login link to downloads
  if ($payerEmail) {
    $token = db_create_login_token((int)$user['id'], 3600); // 1 hour validity
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'photography.christian-boehme.com';
    $loginLink = $scheme . '://' . $host . '/api/login-verify.php?token=' . urlencode($token);
    $accountLink = $scheme . '://' . $host . '/account.html#downloads';
    $subject = 'Thank you for your purchase – your downloads are ready';
    $body = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6;'>
              <h2 style='color: #333;'>Thank you for your purchase!</h2>
              <p>Hello,</p>
              <p>Thank you for your purchase at <strong>Christian Böhme Photography</strong>.</p>
              <p><a href='$accountLink' style='color: #007BFF; text-decoration: none;'>Open your downloads here</a></p>
              <p>Or click this one-time sign-in link (valid for 1 hour):</p>
              <p><a href='$loginLink' style='color: #007BFF; text-decoration: none;'>Sign in</a></p>
              <p>If you didn't make this purchase, please contact support.</p>
              <p style='color: #666; font-size: 0.9em;'>Christian Böhme Photography</p>
              </body></html>";
    $headers = 'From: photography@christian-boehme.com' . "\r\n" .
               'Content-Type: text/html; charset=UTF-8';
    @mail($payerEmail, $subject, $body, $headers);
  }
} catch (Exception $e) {
  if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
}

http_response_code($httpCode ?: 200);
header('Content-Type: application/json');
echo $capRes ?: json_encode(['error' => 'Empty response']);
