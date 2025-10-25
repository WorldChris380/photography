# Deployment Script fuer IONOS
# Kopiert alle noetigen Dateien in einen upload-Ordner

$sourceDistBrowser = "dist\photography\browser"
$sourceSrc = "src"
$destination = "deploy-to-ionos"

# Erstelle deploy-Ordner
Write-Host "Erstelle Deployment-Ordner..." -ForegroundColor Green
if (Test-Path $destination) {
    Remove-Item $destination -Recurse -Force
}
New-Item -ItemType Directory -Path $destination | Out-Null

# Kopiere Angular Build
Write-Host "Kopiere Angular Build..." -ForegroundColor Green
Copy-Item "$sourceDistBrowser\*" -Destination $destination -Recurse -Force

# Erstelle PHP-Ordner
Write-Host "Kopiere PHP-Dateien..." -ForegroundColor Green
New-Item -ItemType Directory -Path "$destination\api" -Force | Out-Null
New-Item -ItemType Directory -Path "$destination\lib" -Force | Out-Null
New-Item -ItemType Directory -Path "$destination\data" -Force | Out-Null
New-Item -ItemType Directory -Path "$destination\private_downloads" -Force | Out-Null

# Kopiere API-Dateien
Copy-Item "$sourceSrc\api\*" -Destination "$destination\api" -Recurse -Force

# Kopiere Lib-Dateien
Copy-Item "$sourceSrc\lib\*" -Destination "$destination\lib" -Recurse -Force

# Kopiere data-Ordner (mit .htaccess)
Copy-Item "$sourceSrc\data\*" -Destination "$destination\data" -Recurse -Force

# Kopiere private_downloads (falls vorhanden)
if (Test-Path "$sourceSrc\private_downloads") {
    Copy-Item "$sourceSrc\private_downloads\*" -Destination "$destination\private_downloads" -Recurse -Force
}

# Kopiere PHP-Dateien im Root
Copy-Item "$sourceSrc\capture-order.php" -Destination $destination -Force -ErrorAction SilentlyContinue
Copy-Item "$sourceSrc\create-order.php" -Destination $destination -Force -ErrorAction SilentlyContinue
Copy-Item "$sourceSrc\get-paypal-client-id.php" -Destination $destination -Force -ErrorAction SilentlyContinue
Copy-Item "$sourceSrc\paypal-secret.php" -Destination $destination -Force -ErrorAction SilentlyContinue
Copy-Item "$sourceSrc\send-email.php" -Destination $destination -Force -ErrorAction SilentlyContinue

# Optionales Debug-Script (nur temporär für Auth-Fehlersuche)
if (Test-Path "debug-paypal.php") {
    Copy-Item "debug-paypal.php" -Destination $destination -Force -ErrorAction SilentlyContinue
}

# Kopiere .htaccess
Write-Host "Erstelle .htaccess..." -ForegroundColor Green
Copy-Item "dist-htaccess.txt" -Destination "$destination\.htaccess" -Force

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Deployment vorbereitet!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ordner: $destination" -ForegroundColor Yellow
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Cyan
Write-Host "1. FileZilla/FTP oeffnen"
Write-Host "2. Verbinde zu photography.christian-boehme.com"
Write-Host "3. Lade ALLE Dateien aus 'deploy-to-ionos' ins Root-Verzeichnis hoch"
Write-Host "4. Teste: https://photography.christian-boehme.com/account"
Write-Host ""
