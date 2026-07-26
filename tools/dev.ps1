Clear-Host

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path $PSScriptRoot -Parent

$Project = Get-Content `
    (Join-Path $ProjectRoot "config\project.json") `
    -Raw |
    ConvertFrom-Json

$Paths = Get-Content `
    (Join-Path $ProjectRoot "config\paths.json") `
    -Raw |
    ConvertFrom-Json

Write-Host ""
Write-Host "$($Project.name) Development"
Write-Host "------------------------------"
Write-Host ""

# ==========================================================
# Build
# ==========================================================

& (Join-Path $PSScriptRoot "build.ps1")

if (!$?)
{
    Write-Host ""
    Write-Host "Build failed."
    exit 1
}

# ==========================================================
# Install
# ==========================================================

& (Join-Path $PSScriptRoot "install.ps1")

if (!$?)
{
    Write-Host ""
    Write-Host "Installation failed."
    exit 1
}

# ==========================================================
# Launch Game
# ==========================================================

if (!(Test-Path $Paths.gamePath))
{
    Write-Host ""
    Write-Host "OMORI installation not found."
    Write-Host $Paths.gamePath
    Write-Host ""

    exit 1
}

Write-Host ""
Write-Host "Launching OMORI..."
Write-Host ""

Start-Process "steam://run/1150690"

Write-Host "Done!"
Write-Host ""
Write-Host "Project : $($Project.name)"
Write-Host "Version : $($Project.version)"
Write-Host "Status  : Development build installed and game launched."
Write-Host ""