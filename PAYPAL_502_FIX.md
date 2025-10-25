# PayPal 502 Bad Gateway - Troubleshooting Guide

## Problem
The browser console shows:
```
POST https://photography.christian-boehme.com/create-order.php 502 (Bad Gateway)
Create order error: {error: 'OAuth token missing', raw: '{"error":"invalid_client",...}'}
```

## Root Cause
**Your web server cannot execute PHP files.** The 502 error means the server tries to load `create-order.php` but fails before PHP can even run.

## Solutions (Try in order)

### 1. Verify PHP is Installed on Server
SSH into your server and run:
```bash
php -v
```
If you see "command not found", **PHP is not installed**.

**Fix for Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install php php-fpm php-curl php-json
```

**Fix for CentOS/RHEL:**
```bash
sudo yum install php php-fpm php-curl php-json
```

---

### 2. Check PHP-FPM Service
If PHP is installed but not running:
```bash
sudo systemctl status php-fpm
# or for older PHP versions:
sudo systemctl status php7.4-fpm
```

**If stopped, start it:**
```bash
sudo systemctl start php-fpm
sudo systemctl enable php-fpm  # Auto-start on boot
```

---

### 3. Configure Nginx to Use PHP
If using **Nginx**, edit your site config (usually `/etc/nginx/sites-available/photography`):

```nginx
server {
    listen 443 ssl http2;
    server_name photography.christian-boehme.com;
    root /var/www/photography;
    index index.html index.php;

    # Serve Angular app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Handle PHP files
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php-fpm.sock;  # Or php7.4-fpm.sock
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # SSL configuration...
}
```

**Test config and reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Configure Apache to Use PHP
If using **Apache**, ensure `mod_php` or `php-fpm` is enabled:

```bash
# For mod_php:
sudo a2enmod php7.4
sudo systemctl restart apache2

# For php-fpm:
sudo a2enmod proxy_fcgi setenvif
sudo a2enconf php7.4-fpm
sudo systemctl restart apache2
```

---

### 5. Check File Permissions
PHP files must be readable by the web server user (usually `www-data` or `nginx`):

```bash
cd /var/www/photography
sudo chown -R www-data:www-data *.php
sudo chmod 644 *.php
```

---

### 6. Verify PayPal Secrets File
After fixing PHP execution, check if `paypal-secret.php` exists:

```bash
ls -la /var/www/photography/paypal-secret.php
```

If missing, create it from the example:
```bash
cp paypal-secret.example.php paypal-secret.php
nano paypal-secret.php  # Edit with your credentials
```

---

### 7. Check PHP Error Logs
After deploying the new build, PHP will log to `paypal_errors.log`:

```bash
tail -f /var/www/photography/paypal_errors.log
```

You should see lines like:
```
create-order.php: Script started
create-order.php: Loading secrets from: /var/www/photography/paypal-secret.php
create-order.php: PayPal ENV: live
create-order.php: Using base URL: https://api-m.paypal.com
```

If you see errors about missing `curl`, install it:
```bash
sudo apt install php-curl
sudo systemctl restart php-fpm
```

---

### 8. Test PHP Directly
Create a test file to verify PHP works:

```bash
echo '<?php phpinfo(); ?>' > /var/www/photography/test.php
```

Visit `https://photography.christian-boehme.com/test.php` in your browser.
- **If you see a PHP info page:** PHP works! The issue is in `create-order.php` or `paypal-secret.php`.
- **If you see 502 or raw code:** PHP is not configured correctly. Revisit steps 2-4.

**Delete test file after:**
```bash
rm /var/www/photography/test.php
```

---

## Quick Diagnosis Command
Run this on your server to check everything:

```bash
php -v && \
systemctl status php-fpm | grep Active && \
ls -la /var/www/photography/paypal-secret.php && \
ls -la /var/www/photography/create-order.php && \
curl -I https://photography.christian-boehme.com/test.php
```

---

## Expected Behavior After Fix
1. Browser console shows: `Create order error: {error: ...}` with actual PayPal API error (not 502)
2. File `/var/www/photography/paypal_errors.log` contains detailed PHP execution logs
3. No more "Bad Gateway" - you'll see HTTP 200 or 40x errors instead

---

## If Still 502 After All Steps
Contact your hosting provider and ask:
> "Can you verify PHP-FPM is configured correctly for my domain? I'm getting 502 errors when accessing .php files."

Provide them with this guide's details.
