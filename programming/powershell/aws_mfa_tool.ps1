[CmdletBinding()]
Param (
  [Parameter(Mandatory=$false, HelpMessage="The AWS Account ID for the group")]
  [string]$accountId=((Read-Host -Prompt "Please enter the AWS Account ID []") -replace '^$', ''),

  [Parameter(Mandatory=$false, HelpMessage="The profile to use for generating the session token")]
  [string]$useProfile=((Read-Host -Prompt 'AWS Profile Name [default]') -replace '^$', 'default'),

  [Parameter(Mandatory=$false, HelpMessage="The IAM user for this connection")]
  #[string]$iamUser=((Read-Host -Prompt 'IAM User [tratliff]') -replace '^$', 'tratliff'),
  [string]$iamUser=((Read-Host -Prompt "IAM User [$env:UserName]") -replace '^$', $env:UserName),

  [Parameter(Mandatory=$false, HelpMessage="The path to your AWS CLI credential file")]
  [string]$credentialFilePath=((Read-Host -Prompt "credential path [$home\.aws\credentials]") -replace '^$', "$home\.aws\credentials"),

  [Parameter(Mandatory=$false, HelpMessage="The time the token should be valid in hours (between 12 and 36) [12]")]
  [double]$tokenLifetimeHours=(Read-Host -Prompt "The time the token should be valid in hours (between 12 and 36) [12]"),

  [Parameter(Mandatory=$false, HelpMessage="The profile that will be updated or created from the results of this execution")]
  [string]$updateProfile=((Read-Host -Prompt 'Update profile [qsrdev]') -replace '^$', 'qsrdev'),

  [Parameter(Mandatory=$false, HelpMessage="The multi-factor authentication token")]
  [string]$tokenCode=(Read-Host -Prompt 'MFA Token Code'),

  [string]$region="us-east-1",
  [switch]$showResults,
  [switch]$noProfileUpdate,
  [switch]$version,
  [switch]$whatIf
)
[string]$scriptVersion="20220111.2"

Write-Host ("`n`nWelcome to the QSR AWS Multifactor Session Tool (version $scriptVersion).`n`n"+
            "    This tool will generate a temporary session token for AWS services when `n"+
            "multi-factor authentication is enabled.  It will put the temporary token `n"+
            "in environment variables as well as your AWS CLI credentials file. `n`n")

Write-Verbose ("`nVerifying parameters`n")

if ($tokenLifetimeHours -eq 0) { $tokenLifetimeHours = 12; }
if ($tokenLifetimeHours -lt 12.00 -or $tokenLifetimeHours -gt 36.00) {
    Write-Warning ("`nA token lifetime of $tokenLifetimeHours hours is out of the range of 12 - 36 hours.  12 hours will be used.`n")
    $tokenLifetimeHours = 12
}
[int]$tokenLifetime = $tokenLifetimeHours * 60 * 60

Write-Verbose ("`nThe following values were provided:`n"+
               "  Account ID = [$accountId]`n"+
               "  Use Profile = [$useProfile]`n"+
               "  IAM User = [$iamUser]`n"+
               "  Credential File Path = [$credentialFilePath]`n"+
               "  Token Lifetime Hours = [$tokenLifetimeHours]`n"+
               "  Token Lifetime = [$tokenLifetime]`n"+
               "  Update Profile = [$updateProfile]`n"+
               "  MFA Token Code = [$tokenCode]`n"+
               "  Region = [$region]`n"+
               "  Show Results = [$showResults]`n"+
               "  No Profile Update = [$noProfileUpdate]`n"+
               "  Version = [$version]`n"+
               "  What If = [$whatIf]`n")

if ($version) { exit 0 }

if ($tokenCode -eq "" -or $tokenCode -eq $null) {
    Write-Error "No MFA token was given"
    exit 1
}

$serial = [string]::Format("arn:aws:iam::{0}:mfa/{1}",$accountId,$iamUser)
Write-Verbose ("`nFormatting the aws serial-number as [$serial]`n")

Write-Verbose ("`nGetting the credentials from AWS`n")
$credentialJSON = $(aws sts get-session-token --serial-number $serial --profile $useProfile --region $region --duration-seconds $tokenLifetime --token-code $tokenCode)
Write-Debug ("`nRaw AWS return`n$credentialJSON`n")

if ($credentialJSON -eq $null) {
    Write-Error ("AWS did NOT return a session token")
    exit 1
}

$credentials = echo $credentialJSON | ConvertFrom-Json
Write-Debug ("`nParsed AWS return`n{0}`n`n" -f $credentials.Credentials)

if ($showResults) {
    Write-Host ("Your AWS temporary session credentials are:`n`n")
    Write-Host $credentials.Credentials
    Write-Host "`n`n"
}

if ($whatIf -ne $true) {
    Write-Verbose ("`nSetting environment variables`n")
    $env:AWS_ACCESS_KEY_ID = $credentials.Credentials.AccessKeyId
    $env:AWS_SECRET_ACCESS_KEY = $credentials.Credentials.SecretAccessKey
    $env:AWS_SESSION_TOKEN = $credentials.Credentials.SessionToken
    $env:AWS_SESSION_EXPIRATION = $credentials.Credentials.Expiration
}

if ($noProfileUpdate -ne $true) {
    Write-Verbose ("`nSetting the credentials in [$credentialFilePath]`n")
    ## [PROFILE_NAME]
    ## aws_access_key_id= ACCESS_KEY_ID
    ## aws_secret_access_key= SECRET_ACCESS_KEY
    ## aws_session_token= SESSION_TOKEN
    ## region=us-east-1
    [string]$newCreds = (("{0}]¦" +
        "aws_access_key_id={1}¦" +
        "aws_secret_access_key={2}¦" +
        "aws_session_token={3}¦" +
        "region={4}¦" +
        "# this token will expire at {5}¦") -f
        $updateProfile,
        $credentials.Credentials.AccessKeyId,
        $credentials.Credentials.SecretAccessKey,
        $credentials.Credentials.SessionToken,
        $region,
        $credentials.Credentials.Expiration)
    Write-Debug ("`nnew credential data:`n$newCreds`n`n")

    Write-Verbose ("`nCopy [$credentialFilePath] to [${credentialFilePath}.bak]`n`n")
    Copy-Item -Path $credentialFilePath -Destination "${credentialFilePath}.bak"


    $oldCredsFile = (Get-Content $credentialFilePath) -Join("¦")
    Write-Debug ("`noldCredsFile.Length = [{0}]`n{1}`n`n" -f $oldCredsFile.Length, $oldCredsFile)

    $credGroups = $oldCredsFile -split "\["

    Write-Verbose ("`nUpdating profile [$updateProfile]`n")
    [bool]$foundProfile = $false
    for ($ii=0; $ii -lt $credGroups.Length; $ii++){
        Write-Debug ("  Comparing <[{0}]>" -f $credGroups[$ii])
        Write-Debug ("    contains $updateProfile = [{0}]" -f $credGroups[$ii].Contains($updateProfile))
        if ($credGroups[$ii].Contains($updateProfile)) {
            Write-Debug ("    replacing old value`n")
            $credGroups[$ii] = $newCreds
            $foundProfile = $true
        }
    }

    if ($foundProfile -eq $false) {
        Write-Verbose ("`n[$updateProfile] not found, creating a new profile`n")
        $credGroups[$credGroups.Length-1] += "¦[$newCreds"
    }

    Write-Debug ("`nprofile count [{0}]`nnew file content`n{1}`n" -f $credGroups.Length, $credGroups.ToString())

    Write-Verbose ("`nWriting updated credentials file`n")
    [string]$newCredentialFile = ($credGroups -Join("[")) -Replace "¦","`n"
    Write-Debug ("`nFinal file update (length [{0}])`n{1}`n" -f $newCredentialFile.Length, $newCredentialFile)
    if ($whatIf -ne $true) {
        Set-Content -Path $credentialFilePath -Value $newCredentialFile
    }
}

Write-Host ("The AWS session token will expire at {0}" -f $credentials.Credentials.Expiration)
exit 0
