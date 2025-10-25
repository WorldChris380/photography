// The PayPal client ID is now provided by the server endpoint get-paypal-client-id.php
// to ensure frontend and backend always use the same app and environment.
// This constant is kept only for backwards compatibility and is not used.
// DO NOT put secrets here; the secret stays server-side in paypal-secret.php.
export const PAYPAL_CLIENT_ID = '';
export const PAYPAL_CURRENCY = 'EUR';
export const PAYPAL_INTENT = 'CAPTURE';
export const DEFAULT_PHOTO_PRICE_EUR = '29.00';
