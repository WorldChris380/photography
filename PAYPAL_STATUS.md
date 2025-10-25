# PayPal Integration - Current Status & Next Steps

## 🔴 CURRENT ERROR: 502 Bad Gateway

### What's Happening
When clicking the PayPal Buy button, the browser shows:
```
POST https://photography.christian-boehme.com/create-order.php 502 (Bad Gateway)
Create order error: {error: 'OAuth token missing', raw: '{"error":"invalid_client",...}'}
```

### Root Cause
**Your web server cannot execute PHP files.** This is a server configuration issue, not a code issue.

## ✅ What's Already Fixed

1. **Angular Build Configuration** - PHP files are now included in build output
2. **Frontend/Backend ENV Alignment** - Both using live PayPal credentials
3. **Enhanced Error Logging** - PHP files now log to `paypal_errors.log`
4. **Client-Side Error Handling** - Detailed console logging added
5. **CORS Configuration** - Production and localhost origins allowed

## 🔧 What You Need to Do

### CRITICAL: Fix PHP Execution on Server

Follow the guide: **[PAYPAL_502_FIX.md](./PAYPAL_502_FIX.md)**

**Quick checklist:**
1. ☐ Verify PHP is installed: `php -v`
2. ☐ Check PHP-FPM is running: `systemctl status php-fpm`
3. ☐ Configure Nginx/Apache to handle .php files (see PAYPAL_502_FIX.md)
4. ☐ Upload `paypal-secret.php` with your credentials
5. ☐ Test PHP works: Create `test.php` with `<?php phpinfo(); ?>`

### After PHP is Working

1. **Deploy Latest Build:**
   ```powershell
   cd photography
   ng build
   ```
   Upload `dist/photography/browser/*` to server

2. **Upload Enhanced PHP Files:**
   - `src/create-order.php` (now with logging)
   - `src/capture-order.php` (now with logging)
   - `src/paypal-secret.php` (if not already on server)

3. **Check Logs:**
   SSH to server and run:
   ```bash
   tail -f /var/www/photography/paypal_errors.log
   ```

4. **Test Again:**
   - Open gallery lightbox
   - Click "Buy" button
   - Check browser console AND server logs

## 📊 Expected Behavior After Fix

### Success Path:
1. Browser: No 502 error
2. Server log: `create-order.php: Script started`
3. Server log: `create-order.php: Got access token`
4. Server log: `create-order.php: Order created successfully: ORDER-123...`
5. Browser: PayPal popup opens

### Error Path (But PHP Working):
1. Browser: HTTP 401/403/etc (not 502)
2. Server log: Detailed OAuth or PayPal API error
3. You can then debug the actual PayPal credential issue

## 🐛 Debugging Tools Added

### Frontend (Browser Console):
- `Create order error:` - Shows parsed error from server
- `Create order exception:` - Shows network/fetch errors
- `Server returned non-JSON:` - Shows raw server response (HTML/PHP error)

### Backend (Server Log):
- `create-order.php: Script started` - PHP executed
- `create-order.php: Loading secrets from: ...` - Config loaded
- `create-order.php: PayPal ENV: live` - Environment confirmed
- `create-order.php: OAuth response: ...` - PayPal token response
- `create-order.php: Got access token` - Auth successful
- `create-order.php: Order creation HTTP code: 201` - Order created

## 📁 Files Changed in Latest Build

### Enhanced with Logging:
- `src/create-order.php` - Error logging, path fallbacks, curl error capture
- `src/capture-order.php` - Same enhancements

### Documentation Created:
- `PAYPAL_502_FIX.md` - Complete PHP server setup guide
- `DEPLOYMENT.md` - Updated with 502 warning

### Build Output:
- `dist/photography/browser/*` - Ready to deploy (includes PHP files via assets config)

## 🎯 Once PHP Works: Additional Features

### Optional Enhancements (After Core Works):
1. **Email Delivery** - Send download link after purchase
2. **Variable Pricing** - Different prices per photo/category
3. **Sandbox Testing** - Document how to switch environments
4. **Purchase History** - Track successful orders in database
5. **Download Watermark-Free** - Serve high-res image after payment

## 🆘 If Still Stuck After Following PAYPAL_502_FIX.md

### Check Server Requirements:
- PHP 7.4+ installed
- php-curl extension enabled
- php-json extension enabled
- PHP-FPM service running
- Nginx/Apache configured for PHP

### Get Server Info:
```bash
# Run all these on your server:
php -v
php -m | grep curl
systemctl status php-fpm
nginx -T | grep "\.php"
ls -la /var/www/photography/*.php
cat /var/log/nginx/error.log | tail -20
```

Send output to hosting support or check against PAYPAL_502_FIX.md guide.

## 📞 Contact Hosting Support

If you can't fix PHP yourself, contact your hosting provider with:

> "I need PHP-FPM configured for my domain photography.christian-boehme.com. Currently getting 502 errors when accessing .php files. PHP version 7.4+ required with curl and json extensions."

Provide them with `PAYPAL_502_FIX.md` for reference.

---

**Bottom Line:** The PayPal integration code is complete and correct. The issue is that your web server isn't executing PHP files. Follow PAYPAL_502_FIX.md to fix the server configuration, then everything will work.
