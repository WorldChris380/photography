# Photography Website - Deployment Guide

## Build & Deploy Prozess

### 1. Angular Build
```powershell
# Aus dem Projekt-Root
cd photography
ng build
```
Das erzeugt die statischen Dateien in `photography/dist/photography/browser/`.

### 2. PHP Dateien separat hochladen

**Wichtig:** Die PHP-Dateien in `src/` werden **nicht** von Angular gebaut. Sie müssen manuell auf den Server hochgeladen werden.

#### Dateien die direkt auf den Server müssen (Root-Verzeichnis):
- `src/send-email.php` → Server: `/send-email.php`
- `src/create-order.php` → Server: `/create-order.php`
- `src/capture-order.php` → Server: `/capture-order.php`
- `src/paypal-secret.php` → Server: `/paypal-secret.php` (**Nie committen! Lokal basierend auf paypal-secret.example.php erstellen**)

#### PayPal Secrets Setup (Server-seitig)
1. Kopiere `src/paypal-secret.example.php` zu `src/paypal-secret.php` (lokal)
2. Trage deine echten PayPal Credentials ein:
   ```php
   define('PAYPAL_CLIENT_ID', 'DEINE_LIVE_ODER_SANDBOX_CLIENT_ID');
   define('PAYPAL_SECRET', 'DEIN_SECRET');
   define('PAYPAL_ENV', 'live'); // oder 'sandbox' für Tests
   define('DEFAULT_PHOTO_PRICE_EUR', '29.00');
   ```
3. Lade **nur** `paypal-secret.php` auf den Server hoch (nicht die .example Datei)
4. Stelle sicher, dass die Datei nicht öffentlich zugänglich ist (nur via PHP include)

### 3. Deploy Workflow

#### Schritt für Schritt:
1. **Build erstellen:**
   ```powershell
   ng build
   ```

2. **Angular Output hochladen:**
   - Alle Dateien aus `dist/photography/browser/` → Server Root

3. **PHP Dateien hochladen:**
   - `src/send-email.php` → Server Root
   - `src/create-order.php` → Server Root
   - `src/capture-order.php` → Server Root
   - `src/paypal-secret.php` → Server Root (nur wenn noch nicht vorhanden/geändert)

4. **⚠️ WICHTIG: PHP muss auf dem Server konfiguriert sein!**
   - Wenn du **502 Bad Gateway** Fehler bekommst, lies: [PAYPAL_502_FIX.md](./PAYPAL_502_FIX.md)
   - PHP-FPM muss laufen und Nginx/Apache muss .php Dateien verarbeiten können

4. **Testen:**
   - Öffne https://photography.christian-boehme.com/create-order.php im Browser
   - Sollte JSON zurückgeben (kein HTML!)
   - Teste gleiches für capture-order.php

### 4. Entwicklungsumgebung

Für lokale Tests mit `ng serve` (http://localhost:4200):
- Die PHP Endpoints sind bereits in CORS für localhost:4200 freigeschaltet
- Du kannst gegen die Production-Endpoints testen oder lokalen PHP-Server aufsetzen

Optional: Lokaler PHP-Server für Development:
```powershell
# Im src/ Verzeichnis
php -S localhost:8000
```
Dann in `photo-gallery.ts` temporär die URLs auf `http://localhost:8000/create-order.php` ändern.

## Troubleshooting

### "Unexpected token '<'" Fehler
- Die PHP-Dateien sind nicht auf dem Server oder nicht ausführbar
- Der Server sendet HTML statt JSON
- Prüfe: Direkter Aufruf von https://photography.christian-boehme.com/create-order.php sollte JSON zeigen

### CORS Fehler
- Stelle sicher dass Origin in den PHP CORS-Headers erlaubt ist
- Bei localhost-Tests: localhost:4200 ist bereits in allowed_origins

### PayPal OAuth Error
- PAYPAL_ENV stimmt nicht mit Client-ID überein (sandbox vs live)
- Secret ist falsch oder fehlt in paypal-secret.php
- Check: Server-Logs für raw OAuth response

### 404 auf PHP Endpoints
- Dateien nicht hochgeladen
- Falscher Pfad (müssen im Root sein, nicht in Unterordnern)
- Apache/nginx config verhindert .php Ausführung
