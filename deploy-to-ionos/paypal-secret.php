<?php
define('PAYPAL_CLIENT_ID', 'AXvy9TcDTJ0L4iRsKTI1-sjfch2ErUdDKCdTwfVTuVRwrogfq7mNO3uClPtPnTMsfdzCLIBh-89Riygj');
define('PAYPAL_SECRET', 'EMyIWGQDpWQLeRbltF8bNE9fExjWVrliA_QrLfHfjpqgZ_Sm0yXBY7j8FUD9dZwJsjncjtE4oip1zB2F');
// 'live' for production or 'sandbox' for testing
define('PAYPAL_ENV', 'live');

// Server-enforced default price to avoid client tampering
define('DEFAULT_PHOTO_PRICE_EUR', '29.00');
// Optional: place high-res originals for downloads here (absolute path on server)
// If undefined, defaults to src/private_downloads
// define('PRIVATE_DOWNLOADS_DIR', '/homepages/17/d901257541/secure_downloads');
