# Prepare Deployment Package for Hostinger Next.js Standalone
$targetDir = "deploy_hostinger"

Write-Host "Starting preparation for Hostinger deployment..." -ForegroundColor Cyan

# 1. Build the project
Write-Host "Building project (npm run build)..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed. Please fix any errors and try again." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. Create clean deployment directory
if (Test-Path $targetDir) {
    Write-Host "Cleaning existing $targetDir directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $targetDir
}
New-Item -ItemType Directory -Path $targetDir | Out-Null

# 3. Copy standalone build
Write-Host "Copying standalone files..." -ForegroundColor Cyan
Copy-Item -Recurse ".next\standalone\*" $targetDir

# 4. Copy static and public assets (Standard procedure for standalone output)
Write-Host "Copying static and public assets..." -ForegroundColor Cyan
if (!(Test-Path "$targetDir\.next\static")) {
    New-Item -ItemType Directory -Path "$targetDir\.next\static" | Out-Null
}
Copy-Item -Recurse ".next\static\*" "$targetDir\.next\static"
Copy-Item -Recurse "public\*" "$targetDir\public"

# 5. Create the zip archive
Write-Host "Creating deploy_hostinger.zip..." -ForegroundColor Cyan
if (Test-Path "deploy_hostinger.zip") {
    Remove-Item "deploy_hostinger.zip"
}
Compress-Archive -Path "$targetDir\*" -DestinationPath "deploy_hostinger.zip"

Write-Host "`nSUCCESS! Your deployment package is ready." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Upload 'deploy_hostinger.zip' to Hostinger File Manager." -ForegroundColor White
Write-Host "2. Extract it in your domain's root folder." -ForegroundColor White
Write-Host "3. In Hostinger Node.js selector, set startup file to 'server.js'." -ForegroundColor White
Write-Host "4. Add your .env variables in the Hostinger panel." -ForegroundColor White
