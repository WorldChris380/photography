<?php
// PayPal configuration loader (no secrets committed)
// Do NOT hardcode real credentials here; they must be provided by environment.

// Prevent direct access to this file
if (!defined('ALLOW_INCLUDE')) {
    http_response_code(403);
    die('Direct access not permitted');
}

// Prefer environment variables (e.g., Apache SetEnv, FPM env, hosting panel)
$clientId = getenv('PAYPAL_CLIENT_ID');
$secret   = getenv('PAYPAL_SECRET');
$env      = getenv('PAYPAL_ENV');

// Fallback to web server vars if provided (e.g., via SetEnv in vhost)
if ($clientId === false || $clientId === '') { $clientId = $_SERVER['PAYPAL_CLIENT_ID'] ?? ''; }
if ($secret   === false || $secret   === '') { $secret   = $_SERVER['PAYPAL_SECRET']   ?? ''; }
if ($env      === false || $env      === '') { $env      = $_SERVER['PAYPAL_ENV']      ?? 'live'; }

// Validate presence
if ($clientId === '' || $secret === '') {
    throw new RuntimeException('PayPal credentials not set in environment');
}

define('PAYPAL_CLIENT_ID', $clientId);
define('PAYPAL_SECRET', $secret);
// 'live' for production or 'sandbox' for testing
define('PAYPAL_ENV', ($env === 'sandbox') ? 'sandbox' : 'live');

// Server-enforced default price to avoid client tampering
if (!defined('DEFAULT_PHOTO_PRICE_EUR')) {
    define('DEFAULT_PHOTO_PRICE_EUR', '29.00');
}
// Optional: place high-res originals for downloads here (absolute path on server)
// If undefined, defaults to src/private_downloads
// define('PRIVATE_DOWNLOADS_DIR', '/homepages/17/d901257541/secure_downloads');
