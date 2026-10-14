# LevelUp V3: install into your existing, working Expo project.
# Run from extracted LevelUp-V3 folder:
# powershell -ExecutionPolicy Bypass -File .\install-into-project.ps1 -ProjectPath "C:\Sahithi\LevelUp-Starter\levelup-app"
param([string]$ProjectPath = 'C:\Sahithi\LevelUp-Starter\levelup-app')
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path -LiteralPath $ProjectPath)) {
  $ProjectPath = Read-Host 'Full path to your existing levelup-app folder (contains package.json)'
}
$ProjectPath = (Resolve-Path -LiteralPath $ProjectPath).Path
if (-not (Test-Path -LiteralPath (Join-Path $ProjectPath 'package.json'))) {
  throw 'Cannot find package.json. Select the EXISTING levelup-app project folder.'
}
if (-not (Test-Path -LiteralPath (Join-Path $here 'src\levelup\catalog.ts'))) {
  throw 'Missing LevelUp V3 source files. Fully extract the ZIP before running this script.'
}

Write-Host "Installing LevelUp V3 into: $ProjectPath" -ForegroundColor Cyan
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$oldApp = Join-Path $ProjectPath 'App.tsx'
if (Test-Path -LiteralPath $oldApp) {
  $backup = Join-Path $ProjectPath ("App.before-LevelUp-V3-$timestamp.txt")
  Copy-Item -LiteralPath $oldApp -Destination $backup
  Write-Host "Previous App.tsx backed up: $backup"
}
$srcRoot = Join-Path $ProjectPath 'src\levelup'
New-Item -ItemType Directory -Force -Path $srcRoot | Out-Null
Copy-Item -LiteralPath (Join-Path $here 'App.tsx') -Destination $oldApp -Force
Copy-Item -Path (Join-Path $here 'src\levelup\*.ts') -Destination $srcRoot -Force

Write-Host 'Installing Expo-compatible packages...' -ForegroundColor Cyan
Push-Location $ProjectPath
try {
  & npx.cmd expo install expo-linear-gradient @expo/vector-icons react-native-safe-area-context @react-native-async-storage/async-storage
  if ($LASTEXITCODE -ne 0) { throw "Dependency install failed (exit code $LASTEXITCODE). App source was copied; retry the expo install command shown in README." }
} finally { Pop-Location }
Write-Host 'LevelUp V3 installed!' -ForegroundColor Green
Write-Host "Next: cd `"$ProjectPath`""
Write-Host 'Then: npx.cmd expo start --tunnel --clear'
