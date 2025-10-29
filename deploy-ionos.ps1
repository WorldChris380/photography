# Deploy to IONOS Script
# This script prepares the deploy-to-ionos folder for uploading to your web host

Write-Host "=== Photography Project - IONOS Deployment Preparation ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the Angular application
Write-Host "Step 1: Building Angular application..." -ForegroundColor Yellow
ng build --configuration production

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Clear deploy-to-ionos folder (except specific files)
Write-Host "Step 2: Clearing deploy-to-ionos folder..." -ForegroundColor Yellow

$deployFolder = "deploy-to-ionos"
$keepFiles = @(
    "paypal-secret.php",
    ".htaccess",
    ".env.example",
    "api",
    "lib",
    "data",
    "private_downloads"
)

# Get all items in deploy folder
Get-ChildItem -Path $deployFolder | ForEach-Object {
    $shouldKeep = $false
    foreach ($keepFile in $keepFiles) {
        if ($_.Name -eq $keepFile) {
            $shouldKeep = $true
            break
        }
    }
    
    if (-not $shouldKeep) {
        Write-Host "  Removing: $($_.Name)" -ForegroundColor Gray
        Remove-Item $_.FullName -Recurse -Force
    }
}

Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host ""

# Step 3: Copy built files
Write-Host "Step 3: Copying build artifacts..." -ForegroundColor Yellow

$distFolder = "dist\photography\browser"

if (-not (Test-Path $distFolder)) {
    Write-Host "Error: Build output folder not found at $distFolder" -ForegroundColor Red
    exit 1
}

# Copy all files from dist to deploy-to-ionos
Copy-Item -Path "$distFolder\*" -Destination $deployFolder -Recurse -Force

Write-Host "Files copied successfully!" -ForegroundColor Green
Write-Host ""

# Step 4: Copy PHP backend files
Write-Host "Step 4: Copying PHP backend files..." -ForegroundColor Yellow

$phpFiles = @(
    "src\capture-order.php",
    "src\create-order.php",
    "src\get-paypal-client-id.php",
    "src\send-email.php",
    "src\test.php",
    "src\view-logs.php",
    "src\debug-paypal.php",
    "src\oauth-test.php"
)

foreach ($file in $phpFiles) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Copy-Item -Path $file -Destination "$deployFolder\$fileName" -Force
        Write-Host "  Copied: $fileName" -ForegroundColor Gray
    }
}

Write-Host "PHP files copied!" -ForegroundColor Green
Write-Host ""

# Step 5: Verify critical files
Write-Host "Step 5: Verifying deployment folder..." -ForegroundColor Yellow

$requiredFiles = @(
    "$deployFolder\index.html",
    "$deployFolder\.htaccess",
    "$deployFolder\paypal-secret.php",
    "$deployFolder\api\login-request.php",
    "$deployFolder\lib\db.php"
)

$allPresent = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""

if ($allPresent) {
    Write-Host "=== Deployment folder is ready! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Set environment variables on IONOS (see README.md):" -ForegroundColor White
    Write-Host "   - PAYPAL_CLIENT_ID" -ForegroundColor Gray
    Write-Host "   - PAYPAL_SECRET" -ForegroundColor Gray
    Write-Host "   - PAYPAL_ENV" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Upload deploy-to-ionos folder contents to your web root" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Ensure data/ and private_downloads/ folders are writable" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "=== WARNING: Some files are missing! ===" -ForegroundColor Red
    Write-Host "Please check the errors above before deploying." -ForegroundColor Yellow
}
