<?php
// Prevent direct access to this file
if (!defined('ALLOW_INCLUDE')) {
    http_response_code(403);
    die('Direct access not permitted');
}

define('PAYPAL_CLIENT_ID', 'AQ8msxb9NIL7H6Gb6uc-C9lO8n_sw8d4ZCl2kzkk-j6ygpNuLWxIlL8iQIv5h1F5H-uNgEZiDYRJD4VS');
define('PAYPAL_SECRET', 'EEmpNXvtLrOPH5YwjiCXgi89Td9rj07G4dFvhId4Tk9jbdC8KjpimAUJAMjXEIt4xhjcKy2KzR_8tRLH');
// 'live' for production or 'sandbox' for testing
define('PAYPAL_ENV', 'live');

// Server-enforced default price to avoid client tampering
define('DEFAULT_PHOTO_PRICE_EUR', '29.00');
// Optional: place high-res originals for downloads here (absolute path on server)
// If undefined, defaults to src/private_downloads
// define('PRIVATE_DOWNLOADS_DIR', '/homepages/17/d901257541/secure_downloads');
