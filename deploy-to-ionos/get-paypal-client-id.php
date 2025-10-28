<?php
// Return public PayPal client-id and env as JSON
error_reporting(0);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/paypal_errors.log');

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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json');

$secretFile = __DIR__ . '/paypal-secret.php';
if (!file_exists($secretFile)) {
  http_response_code(500);
  echo json_encode(['error' => 'Server not configured']);
  exit;
}
define('ALLOW_INCLUDE', true);
require_once $secretFile;

$clientId = defined('PAYPAL_CLIENT_ID') ? trim(PAYPAL_CLIENT_ID) : '';
$env = defined('PAYPAL_ENV') ? PAYPAL_ENV : 'live';

if ($clientId === '') {
  http_response_code(500);
  echo json_encode(['error' => 'Client ID missing']);
  exit;
}

echo json_encode([
  'client_id' => $clientId,
  'env' => $env
]);
