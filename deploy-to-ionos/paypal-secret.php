<?php
// Prevent direct access to this file
if (!defined('ALLOW_INCLUDE')) {
    http_response_code(403);
    die('Direct access not permitted');
}

define('PAYPAL_CLIENT_ID', 'AWHmzoyOY2yumMjklD4aakazIFg5kxAVgkrKyRO3IQ-Qhd0jl_I0WcgciEHgorETTKX1xAIOOmjHmhFd');
define('PAYPAL_SECRET', 'EK_bmB8mnBGJHqFPO8ZOgGzS_BTyi6lNDUJmOwryuN_qjCSkfhiPGJAD0Wr8bNqFTO97RucTLbQUqfr8');
// 'live' for production or 'sandbox' for testing
define('PAYPAL_ENV', 'live');

// Server-enforced default price to avoid client tampering
define('DEFAULT_PHOTO_PRICE_EUR', '29.00');
// Optional: place high-res originals for downloads here (absolute path on server)
// If undefined, defaults to src/private_downloads
// define('PRIVATE_DOWNLOADS_DIR', '/homepages/17/d901257541/secure_downloads');
