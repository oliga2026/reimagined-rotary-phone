param(
    [Parameter(Mandatory = $true)]
    [string]$To,

    [Parameter(Mandatory = $true)]
    [string]$Subject,

    [string]$Body,

    [string]$BodyFile
)

$smtpHost = if ($env:QQ_SMTP_HOST) { $env:QQ_SMTP_HOST } else { "smtp.qq.com" }
$smtpPort = if ($env:QQ_SMTP_PORT) { [int]$env:QQ_SMTP_PORT } else { 465 }
$smtpUser = $env:QQ_SMTP_USER
$smtpAuthCode = $env:QQ_SMTP_AUTH_CODE

if (-not $smtpUser -or -not $smtpAuthCode) {
    throw "Missing QQ_SMTP_USER or QQ_SMTP_AUTH_CODE environment variable."
}

if ($BodyFile) {
    $Body = Get-Content -LiteralPath $BodyFile -Raw -Encoding UTF8
}

if (-not $Body) {
    $Body = ""
}

$securePassword = ConvertTo-SecureString $smtpAuthCode -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($smtpUser, $securePassword)

Send-MailMessage `
    -From $smtpUser `
    -To $To `
    -Subject $Subject `
    -Body $Body `
    -SmtpServer $smtpHost `
    -Port $smtpPort `
    -UseSsl `
    -Credential $credential `
    -Encoding UTF8
