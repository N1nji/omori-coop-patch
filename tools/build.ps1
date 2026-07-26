Clear-Host

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path $PSScriptRoot -Parent

$Project = Get-Content `
    (Join-Path $ProjectRoot "config\project.json") `
    -Raw |
    ConvertFrom-Json

$Dist = Join-Path $ProjectRoot "dist"
$Src = Join-Path $ProjectRoot "src"
$Plugins = Join-Path $Dist "plugins"

Write-Host ""
Write-Host "$($Project.name) Build"
Write-Host "-------------------------"
Write-Host ""

# UTF-8 sem BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Limpa dist
if (Test-Path $Dist) {
    Remove-Item $Dist -Recurse -Force
}

# Cria estrutura
New-Item $Dist -ItemType Directory | Out-Null
New-Item $Plugins -ItemType Directory | Out-Null

# ==========================================================
# Bundle
# ==========================================================

$PluginOutput = Join-Path $Plugins $Project.plugin.entry
$Bundle = New-Object System.Text.StringBuilder

Write-Host "Bundling files..."
Write-Host ""

foreach ($RelativePath in $Project.bundle) {
    $FullPath = Join-Path $Src $RelativePath

    if (!(Test-Path $FullPath)) {
        throw "Bundle file not found: $RelativePath"
    }

    Write-Host " + $RelativePath"

    [void]$Bundle.AppendLine("// =====================================================")
    [void]$Bundle.AppendLine("// $RelativePath")
    [void]$Bundle.AppendLine("// =====================================================")
    [void]$Bundle.AppendLine()

    [void]$Bundle.Append(
        [System.IO.File]::ReadAllText(
            $FullPath,
            [System.Text.Encoding]::UTF8
        )
    )

    [void]$Bundle.AppendLine()
    [void]$Bundle.AppendLine()
}

[System.IO.File]::WriteAllText(
    $PluginOutput,
    $Bundle.ToString(),
    $utf8NoBom
)

Write-Host ""
Write-Host "Bundle generated successfully!"
Write-Host ""

# ==========================================================
# mod.json
# ==========================================================

$Manifest = [ordered]@{
    '$schema' = "https://rph.space/oneloader.manifestv1.schema.json"
    id = $Project.id
    name = $Project.name
    description = $Project.description
    version = $Project.version
    manifestVersion = $Project.manifestVersion

    files = [ordered]@{
        plugins = @(
            "plugins/$($Project.plugin.entry)"
        )
        text = @()
        data = @()
        maps = @()
        assets = @()
        exec = @()
    }
}

$json = $Manifest | ConvertTo-Json -Depth 10

[System.IO.File]::WriteAllText(
    (Join-Path $Dist "mod.json"),
    $json,
    $utf8NoBom
)

Write-Host ""
Write-Host "Build OK!"
Write-Host ""