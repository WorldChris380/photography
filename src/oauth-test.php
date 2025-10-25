<?php
// Simple OAuth test endpoint to validate PayPal credentials. Remove after use.
error_reporting(E_ALL);
ini_set('display_errors', '1');

header('Content-Type: application/json');

$log = function($msg){ error_log('oauth-test.php: ' . $msg); };
$log('Script started');

$secretFile = __DIR__ . '/paypal-secret.php';
if (!file_exists($secretFile)) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'paypal-secret.php missing','dir'=>__DIR__]);
  exit;
}
define('ALLOW_INCLUDE', true);
require_once $secretFile;

$base = (defined('PAYPAL_ENV') && PAYPAL_ENV === 'sandbox') ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
$clientId = trim(PAYPAL_CLIENT_ID ?? '');
$secret   = trim(PAYPAL_SECRET ?? '');

if ($clientId === '' || $secret === '') {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'Missing client credentials']);
  exit;
}

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
  CURLOPT_USERPWD => $clientId . ':' . $secret,
  CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'client_credentials']),
  CURLOPT_TIMEOUT => 30,
  CURLOPT_CONNECTTIMEOUT => 10,
  CURLOPT_SSL_VERIFYPEER => true,
  CURLOPT_SSL_VERIFYHOST => 2
]);

$res = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
$errno = curl_errno($ch);
curl_close($ch);

$out = [
  'env' => PAYPAL_ENV ?? 'undefined',
  'base' => $base,
  'client_id_prefix' => substr($clientId,0,20),
  'client_id_len' => strlen($clientId),
  'secret_prefix' => substr($secret,0,10),
  'secret_len' => strlen($secret),
  'http_code' => $httpCode,
  'errno' => $errno,
];

if ($res === false || $errno !== 0) {
  $out['ok'] = false;
  $out['error'] = $err;
  http_response_code(502);
  echo json_encode($out);
  exit;
}

$decoded = json_decode($res, true);
$out['raw'] = $res;
$out['ok'] = isset($decoded['access_token']);

http_response_code($out['ok'] ? 200 : 401);
echo json_encode($out);
