param(
    [string]$Message = "Update World Cup reports"
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

git add index.html styles.css app.js data/reports.json README.md .nojekyll

$changes = git status --porcelain
if (-not $changes) {
    Write-Host "No report changes to publish."
    exit 0
}

git commit -m $Message
git push origin main
