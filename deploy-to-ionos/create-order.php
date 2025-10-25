<?php
// Enable error logging to debug 502 issues
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Don't display errors in response
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/paypal_errors.log');

// Robust CORS handling with allowlist
// TIP: Remove localhost origins in production for tighter security
$allowed_origins = [
  'https://photography.christian-boehme.com',
  // 'http://localhost:4200',
  // 'https://localhost:4200'
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
} else {
  header('Access-Control-Allow-Origin: https://photography.christian-boehme.com');
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json');

// Log execution for debugging 502 errors
error_log("create-order.php: Script started");
error_log("create-order.php: __DIR__ = " . __DIR__);
error_log("create-order.php: Script path = " . __FILE__);

// Load secrets - try multiple locations
$secretFile = __DIR__ . '/paypal-secret.php';
error_log("create-order.php: Checking primary location: $secretFile");
error_log("create-order.php: File exists? " . (file_exists($secretFile) ? 'YES' : 'NO'));

if (!file_exists($secretFile)) {
  // Try parent directory (in case of deployment path differences)
  $secretFile = dirname(__DIR__) . '/paypal-secret.php';
  error_log("create-order.php: Checking parent directory: $secretFile");
  error_log("create-order.php: File exists? " . (file_exists($secretFile) ? 'YES' : 'NO'));
}

if (!file_exists($secretFile)) {
  error_log("create-order.php: paypal-secret.php not found in __DIR__ or parent");
  error_log("create-order.php: Directory contents: " . print_r(scandir(__DIR__), true));
  http_response_code(500);
  echo json_encode([
    'error' => 'Server not configured: paypal-secret.php missing',
    'dir' => __DIR__,
    'checked_paths' => [
      __DIR__ . '/paypal-secret.php',
      dirname(__DIR__) . '/paypal-secret.php'
    ],
    'dir_contents' => array_values(array_diff(scandir(__DIR__), ['.', '..']))
  ]);
  exit;
}

error_log("create-order.php: Loading secrets from: $secretFile");
error_log("create-order.php: About to require_once paypal-secret.php");

try {
  require_once $secretFile;
  error_log("create-order.php: paypal-secret.php loaded successfully");
} catch (Exception $e) {
  error_log("create-order.php: ERROR loading paypal-secret.php: " . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Failed to load config', 'details' => $e->getMessage()]);
  exit;
}

$base = (defined('PAYPAL_ENV') && PAYPAL_ENV === 'sandbox')
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

error_log("create-order.php: PayPal ENV: " . (defined('PAYPAL_ENV') ? PAYPAL_ENV : 'undefined'));
error_log("create-order.php: Using base URL: $base");

// Verify constants are defined
if (!defined('PAYPAL_CLIENT_ID') || !defined('PAYPAL_SECRET')) {
  error_log("create-order.php: PayPal credentials not defined");
  http_response_code(500);
  echo json_encode(['error' => 'PayPal credentials not configured']);
  exit;
}

// Get OAuth token
error_log("create-order.php: Requesting OAuth token");
// Trim to avoid invisible whitespace from copy/paste
$__clientId = trim(PAYPAL_CLIENT_ID);
$__secret   = trim(PAYPAL_SECRET);
error_log("create-order.php: Using CLIENT_ID: " . substr($__clientId, 0, 20) . "... (len=" . strlen($__clientId) . ")");
error_log("create-order.php: Using SECRET: " . substr($__secret, 0, 10) . "... (len=" . strlen($__secret) . ")");

$ch = curl_init("$base/v1/oauth2/token");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/x-www-form-urlencoded',
    'Accept: application/json',
    'Accept-Language: en_US'
  ],
  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
  CURLOPT_USERPWD => $__clientId . ':' . $__secret,
  CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'client_credentials']),
  CURLOPT_TIMEOUT => 30,
  CURLOPT_CONNECTTIMEOUT => 10,
  CURLOPT_SSL_VERIFYPEER => true,
  CURLOPT_SSL_VERIFYHOST => 2
]);

$tokenRes = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);

if ($tokenRes === false || $curlErrno !== 0) {
  error_log("create-order.php: OAuth curl failed - errno: $curlErrno, error: $curlError");
  curl_close($ch);
  http_response_code(502);
  echo json_encode([
    'error' => 'OAuth request failed',
    'details' => $curlError,
    'errno' => $curlErrno,
    'http_code' => $httpCode
  ]);
  exit;
}

curl_close($ch);
error_log("create-order.php: OAuth HTTP code: $httpCode");
error_log("create-order.php: OAuth response: $tokenRes");

$tokenInfo = json_decode($tokenRes, true);
if (!isset($tokenInfo['access_token'])) {
  error_log("create-order.php: No access token in response");
  http_response_code(401);
  echo json_encode([
    'error' => 'OAuth token missing',
    'raw' => $tokenRes,
    'http_code' => $httpCode,
    'decoded' => $tokenInfo
  ]);
  exit;
}
$accessToken = $tokenInfo['access_token'];
error_log("create-order.php: Got access token successfully");

// Read request body
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$description = isset($input['description']) ? substr($input['description'], 0, 127) : 'Photo purchase';
$custom_id = isset($input['src']) ? substr($input['src'], 0, 127) : 'photo';
$amountValue = defined('DEFAULT_PHOTO_PRICE_EUR') ? DEFAULT_PHOTO_PRICE_EUR : '29.00';

$orderBody = [
  'intent' => 'CAPTURE',
  'application_context' => [
    'shipping_preference' => 'NO_SHIPPING',
    'brand_name' => 'Christian Boehme Photography'
  ],
  'purchase_units' => [[
    'amount' => [ 'currency_code' => 'EUR', 'value' => $amountValue ],
    'description' => $description,
    'custom_id' => $custom_id
  ]]
];

// Create order
error_log("create-order.php: Creating PayPal order");
$ch2 = curl_init("$base/v2/checkout/orders");
curl_setopt_array($ch2, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $accessToken
  ],
  CURLOPT_POSTFIELDS => json_encode($orderBody),
  CURLOPT_TIMEOUT => 30,
  CURLOPT_CONNECTTIMEOUT => 10,
  CURLOPT_SSL_VERIFYPEER => true,
  CURLOPT_SSL_VERIFYHOST => 2
]);

$orderRes = curl_exec($ch2);
$httpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
$curlError2 = curl_error($ch2);
$curlErrno2 = curl_errno($ch2);
curl_close($ch2);

error_log("create-order.php: Order creation HTTP code: $httpCode");
error_log("create-order.php: Order response: " . ($orderRes ?: 'empty'));

if ($orderRes === false || $curlErrno2 !== 0) {
  error_log("create-order.php: Order curl failed - errno: $curlErrno2, error: $curlError2");
  http_response_code(502);
  echo json_encode([
    'error' => 'Order creation failed',
    'details' => $curlError2,
    'errno' => $curlErrno2,
    'http_code' => $httpCode
  ]);
  exit;
}

http_response_code($httpCode ?: 200);
echo $orderRes ?: json_encode(['error' => 'Empty response']);
error_log("create-order.php: Script completed successfully");
