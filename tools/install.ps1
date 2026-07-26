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

$Dist = Join-Path $ProjectRoot "dist"

# Caminhos
$ModsFolder = Join-Path $Paths.gamePath "www\mods"
$Destination = Join-Path $ModsFolder $Project.id
$Plugin = Join-Path $Dist "plugins\$($Project.plugin.entry)"

Write-Host ""
Write-Host "$($Project.name) Install"
Write-Host "---------------------------"
Write-Host ""

# ==========================================================
# Validações
# ==========================================================

if (!(Test-Path $Dist))
{
    throw "Build folder not found. Execute build.ps1 first."
}

if (!(Test-Path $Plugin))
{
    throw "Plugin bundle not found.`nExecute build.ps1 first."
}

if (!(Test-Path $Paths.gamePath))
{
    throw "OMORI installation not found.`n$($Paths.gamePath)"
}

if (!(Test-Path $ModsFolder))
{
    throw "Mods folder not found.`n$ModsFolder"
}

# ==========================================================
# Instalação
# ==========================================================

if (Test-Path $Destination)
{
    Write-Host "Removing previous installation..."
    Remove-Item $Destination -Recurse -Force
}

Write-Host "Installing mod..."

Copy-Item `
    $Dist `
    $Destination `
    -Recurse

# ==========================================================
# Finalização
# ==========================================================

Write-Host ""
Write-Host "Install OK!"
Write-Host ""

Write-Host "Project : $($Project.name)"
Write-Host "Version : $($Project.version)"
Write-Host "Location: $Destination"

Write-Host ""