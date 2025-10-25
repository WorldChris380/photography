<?php
// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/paypal_errors.log');

// CORS headers
header('Access-Control-Allow-Origin: https://photography.christian-boehme.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

error_log("capture-order.php: Script started");

// Load secrets - try multiple locations
$secretFile = __DIR__ . '/paypal-secret.php';
if (!file_exists($secretFile)) {
  $secretFile = dirname(__DIR__) . '/paypal-secret.php';
}
if (!file_exists($secretFile)) {
  error_log("capture-order.php: paypal-secret.php not found");
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Server not configured: paypal-secret.php missing']);
  exit;
}
error_log("capture-order.php: Loading secrets from: $secretFile");
require_once $secretFile;

$base = (defined('PAYPAL_ENV') && PAYPAL_ENV === 'sandbox')
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

// Get OAuth token
$ch = curl_init("$base/v1/oauth2/token");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [ 'Content-Type: application/x-www-form-urlencoded' ],
  CURLOPT_USERPWD => PAYPAL_CLIENT_ID . ':' . PAYPAL_SECRET,
  CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'client_credentials'])
]);
$tokenRes = curl_exec($ch);
if ($tokenRes === false) { http_response_code(502); echo json_encode(['error' => 'OAuth request failed']); exit; }
$tokenInfo = json_decode($tokenRes, true);
curl_close($ch);
if (!isset($tokenInfo['access_token'])) { http_response_code(502); echo json_encode(['error' => 'OAuth token missing']); exit; }
$accessToken = $tokenInfo['access_token'];

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$orderID = $input['orderID'] ?? null;
if (!$orderID) { http_response_code(400); echo json_encode(['error' => 'orderID is required']); exit; }

$ch2 = curl_init("$base/v2/checkout/orders/" . urlencode($orderID) . "/capture");
curl_setopt_array($ch2, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $accessToken
  ]
]);
$capRes = curl_exec($ch2);
$httpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

http_response_code($httpCode ?: 200);
header('Content-Type: application/json');
echo $capRes ?: json_encode(['error' => 'Empty response']);
