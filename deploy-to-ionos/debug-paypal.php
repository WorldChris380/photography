<?php
// Debug PayPal OAuth with detailed logging
// Enable verbose PHP errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

define('ALLOW_INCLUDE', true);
// Locate paypal-secret.php in common deployment layouts
$secretCandidates = [
    __DIR__ . '/paypal-secret.php',          // deployed to web root (deploy-ionos.ps1 behavior)
    __DIR__ . '/src/paypal-secret.php',      // local dev or alternative deploy
    dirname(__DIR__) . '/paypal-secret.php', // one level up
];
$secretFile = null;
foreach ($secretCandidates as $cand) {
    if (is_readable($cand)) { $secretFile = $cand; break; }
}
if (!$secretFile) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Could not locate paypal-secret.php. Tried:\n" . implode("\n", $secretCandidates);
    exit;
}
require_once $secretFile;

header('Content-Type: text/plain; charset=utf-8');

$clientId = trim(PAYPAL_CLIENT_ID);
$secret = trim(PAYPAL_SECRET);
$env = PAYPAL_ENV;
$base = ($env === 'sandbox') ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

echo "=== PayPal OAuth Debug ===\n\n";
echo "Environment: $env\n";
echo "Secrets file: $secretFile\n";
echo "Base URL: $base\n";
echo "Client ID Length: " . strlen($clientId) . "\n";
echo "Client ID First 30 chars: " . substr($clientId, 0, 30) . "...\n";
echo "Secret Length: " . strlen($secret) . "\n";
echo "Secret First 20 chars: " . substr($secret, 0, 20) . "...\n";
echo "\n--- Making OAuth Request ---\n\n";

// Helper to perform OAuth using cURL or fallback to streams if cURL is unavailable
$doOAuth = function(string $base, string $clientId, string $secret) {
    $endpoint = "$base/v1/oauth2/token";
    $postData = 'grant_type=client_credentials';

    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_VERBOSE => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Accept-Language: en_US'
            ],
            CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_USERPWD => $clientId . ':' . $secret,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2
        ]);

        // Capture verbose output
        $verbose = fopen('php://temp', 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $verbose);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        $info = curl_getinfo($ch);

        rewind($verbose);
        $verboseLog = stream_get_contents($verbose);
        fclose($verbose);
        curl_close($ch);

        return [
            'httpCode' => $httpCode,
            'response' => $response,
            'error' => $curlError,
            'info' => $info,
            'verbose' => $verboseLog,
            'transport' => 'curl'
        ];
    }

    // Fallback using streams (no cURL extension)
    $auth = base64_encode($clientId . ':' . $secret);
    $opts = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n" .
                        "Accept: application/json\r\n" .
                        "Accept-Language: en_US\r\n" .
                        "Authorization: Basic $auth\r\n",
            'content' => $postData,
            'ignore_errors' => true,
            'timeout' => 30,
        ]
    ];
    $context = stream_context_create($opts);
    $response = @file_get_contents($endpoint, false, $context);
    $httpCode = 0;
    if (isset($http_response_header[0]) && preg_match('#HTTP/\S+\s+(\d{3})#', $http_response_header[0], $m)) {
        $httpCode = (int)$m[1];
    }
    return [
        'httpCode' => $httpCode,
        'response' => $response !== false ? $response : '',
        'error' => $response === false ? 'stream request failed' : '',
        'info' => ['transport' => 'streams'],
        'verbose' => implode("\n", $http_response_header ?? []),
        'transport' => 'streams'
    ];
};

// Try configured environment first
$result = $doOAuth($base, $clientId, $secret);
$httpCode = $result['httpCode'];
$response = $result['response'];
$curlError = $result['error'];
$info = $result['info'];
$verboseLog = $result['verbose'];

// If invalid_client, also probe the opposite environment to detect mismatch
$altTried = false;
$altResult = null;
if ($httpCode === 401 && strpos($response, 'invalid_client') !== false) {
    $altBase = ($base === 'https://api-m.paypal.com')
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';
    $altTried = true;
    echo "\n--- Probing alternate environment: $altBase ---\n";
    $altResult = $doOAuth($altBase, $clientId, $secret);
}

echo "HTTP Status Code: $httpCode\n";
echo "cURL Error: " . ($curlError ?: 'none') . "\n";
echo "\n--- Response ---\n";
echo $response . "\n";
echo "\n--- Transport Info ---\n";
print_r($info);
echo "\n--- Verbose Log ---\n";
echo $verboseLog;

echo "\n\n=== Diagnosis ===\n";
if ($httpCode === 200) {
    echo "✅ SUCCESS! Authentication works.\n";
    $data = json_decode($response, true);
    if (isset($data['access_token'])) {
        echo "Access Token received: " . substr($data['access_token'], 0, 30) . "...\n";
    }
} elseif ($httpCode === 401) {
    echo "❌ UNAUTHORIZED (401)\n";
    echo "Possible causes:\n";
    echo "1. Client ID or Secret is incorrect\n";
    echo "2. Keys are for different environment (sandbox vs live)\n";
    echo "3. App in PayPal dashboard is not active\n";
    echo "4. Keys have been revoked\n";
    if ($altTried && $altResult) {
        echo "\nAlternate environment probe result: HTTP " . $altResult['httpCode'] . "\n";
        echo "Alt response: " . $altResult['response'] . "\n";
        if ($altResult['httpCode'] === 200) {
            echo "\n➡️ Your keys appear to work in the alternate environment.\n";
            echo "   This means your PAYPAL_ENV is likely set to the wrong value.\n";
        }
    }
    echo "\nACTION: Go to https://developer.paypal.com/dashboard/\n";
    echo "  - Verify you're in the correct environment ($env)\n";
    echo "  - Check 'My Apps & Credentials'\n";
    echo "  - Regenerate keys if needed\n";
} else {
    echo "❌ UNEXPECTED HTTP CODE: $httpCode\n";
    echo "Check response details above.\n";
}
