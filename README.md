# OMORI Coop Fixes

A community-driven project focused on improving the Local Multiplayer mod for OMORI.

## Goals

- Fix softlocks
- Fix black screens
- Improve cutscene synchronization
- Better map transfers
- Better Parsec experience
- Better debugging
- Keep compatibility with OneLoader

Status:
🚧 In Development

## Build

O `mod.json` deve ser salvo em **UTF-8 sem BOM**.

O OneLoader utiliza `JSON.parse()` diretamente no conteúdo do arquivo e falha ao interpretar arquivos salvos em UTF-8 with BOM.

Por esse motivo, o build utiliza:

```powershell
[System.IO.File]::WriteAllText(..., (New-Object System.Text.UTF8Encoding($false)))