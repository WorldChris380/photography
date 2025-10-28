<?php
// PayPal configuration loader (no secrets committed)
// This file defines the constants expected by the app by reading
// values from environment variables or server vars. Do NOT hardcode
// real credentials here.

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
	// Intentionally generic to avoid leaking details
	throw new RuntimeException('PayPal credentials not set in environment');
}

// Define constants used by the rest of the app
define('PAYPAL_CLIENT_ID', $clientId);
define('PAYPAL_SECRET', $secret);
// 'live' for production or 'sandbox' for testing
define('PAYPAL_ENV', ($env === 'sandbox') ? 'sandbox' : 'live');

// Server-enforced default price to avoid client tampering (not a secret)
if (!defined('DEFAULT_PHOTO_PRICE_EUR')) {
	define('DEFAULT_PHOTO_PRICE_EUR', '29.00');
}
