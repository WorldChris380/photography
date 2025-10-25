<?php
// Test PayPal Authentication
define('ALLOW_INCLUDE', true);
require_once __DIR__ . '/src/paypal-secret.php';

$clientId = PAYPAL_CLIENT_ID;
$secret = PAYPAL_SECRET;
$env = PAYPAL_ENV;

$base = ($env === 'sandbox') ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

echo "<h2>PayPal Authentication Test</h2>";
echo "<p><strong>Environment:</strong> $env</p>";
echo "<p><strong>API Base:</strong> $base</p>";
echo "<p><strong>Client ID:</strong> " . substr($clientId, 0, 20) . "...</p>";
echo "<hr>";

$ch = curl_init("$base/v1/oauth2/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
curl_setopt($ch, CURLOPT_USERPWD, "$clientId:$secret");
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Accept-Language: en_US']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "<p><strong>HTTP Status:</strong> $httpCode</p>";

if ($httpCode === 200) {
    echo "<p style='color: green;'><strong>✅ SUCCESS - Authentication works!</strong></p>";
    $data = json_decode($response, true);
    echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
} else {
    echo "<p style='color: red;'><strong>❌ FAILED - Authentication failed!</strong></p>";
    echo "<p><strong>Error:</strong> $error</p>";
    echo "<p><strong>Response:</strong></p>";
    echo "<pre>$response</pre>";
}

echo "<hr>";
echo "<h3>Possible Issues:</h3>";
echo "<ul>";
echo "<li>Keys might be revoked (check PayPal dashboard)</li>";
echo "<li>Keys might be for wrong environment (sandbox vs live)</li>";
echo "<li>Keys might have insufficient permissions</li>";
echo "<li>Network/firewall issues</li>";
echo "</ul>";
