[CmdletBinding()]
Param (
  [Parameter(Mandatory=$false, HelpMessage="The AWS Account ID for the group")]
  [string]$accountId,

  [Parameter(Mandatory=$false, HelpMessage="The profile to use for generating the session token")]
  [string]$useProfile,

  [Parameter(Mandatory=$false, HelpMessage="The IAM user for this connection")]
  [string]$iamUser,

  [Parameter(Mandatory=$false, HelpMessage="The path to your AWS CLI credential file")]
  [string]$credentialFilePath,

  [Parameter(Mandatory=$false, HelpMessage="The time the token should be valid in hours (between 12 and 36) [12]")]
  [double]$tokenLifetimeHours,

  [Parameter(Mandatory=$false, HelpMessage="The profile that will be updated or created from the results of this execution")]
  [string]$updateProfile,

  [Parameter(Mandatory=$false, HelpMessage="The multi-factor authentication token")]
  [string]$tokenCode,

  [Parameter(Mandatory=$false, HelpMessage="The AWS account user name for which you want to change the password")]
  [string]$passwordUserName,

  [Parameter(Mandatory=$false, HelpMessage="The password you want to use for your AWS account password")]
  [string]$password,

  [string]$region="us-east-1",
  [switch]$showResults,
  [switch]$noProfileUpdate,
  [switch]$version,
  [switch]$defaults,
  [switch]$d,
  [switch]$changePassword,
  [switch]$whatIf
)
$PSDefaultParameterValues['*:Encoding'] = 'utf8NoBOM'
[string]$scriptVersion="20220926.0"

Write-Host ("`n`nWelcome to the QSR AWS Multifactor Session Tool (version $scriptVersion).`n`n"+
            "    This tool will generate a temporary session token for AWS services when `n"+
            "multi-factor authentication is enabled.  It will put the temporary token `n"+
            "in environment variables as well as your AWS CLI credentials file. `n"+
            "    It can also change your AWS IAM account passwords after you have `n"+
            "generated a temporary MFA token for that account.`n`n")
#----
# test for default parameter: if present set smart defaults and only ask for pin
#----
if ($default -or $d -or $version) {
    $accountId = '000000000000'
    $useProfile = 'userdev'
    $iamUser = $env:UserName
    $credentialFilePath = "$home\.aws\credentials"
    $tokenLifetimeHours = 12
    $updateProfile = 'default'
} elseif ($changePassword -eq $true) {
    if ($passwordUserName -eq $null -or $passwordUserName -eq '') {
        $passwordUserName=((Read-Host -Prompt "AWS IAM User Name [$env:UserName]") -replace '^$',  $env:UserName)
    }

    while ($password -eq $null -or $password -eq '' -or $password -match '[`"]') {
        $password=((Read-Host -Prompt "Enter your desired password for [$passwordUserName]; please don't use the characters in the brackets [```"]" -MaskInput))
    }

    Write-Host "About to run the following command:"
    Write-Host "  aws iam update-login-profile --user-name $passwordUserName --password `"****`"`n"

    [string]$continue=((Read-Host -Prompt "Continue [No]|Yes|Verify") -replace '^$', 'No')

    if ($continue -eq 'verify' -or $continue -eq 'v') {
        Write-Host "The password you entered was`n$password`n"
        $continue=((Read-Host -Prompt "Continue [No]|Yes") -replace '^$', 'No')
    }

    if (($continue -eq 'yes' -or $continue -eq 'y') -and $whatIf -eq $false) {
        aws iam update-login-profile --user-name $passwordUserName --password "$password"
    } else {
        Write-Host "No action taken.`n"
    }

    exit 0
} else {
    if ($accountId -eq $null -or $accountId -eq '') {
        $accountId=((Read-Host -Prompt "Please enter the AWS Account ID") -replace '^$', '000000000000')
    }

    if ($useProfile -eq $null -or $useProfile -eq '') {
        $useProfile=((Read-Host -Prompt 'AWS User Profile Name [userdev]') -replace '^$', 'userdev')
    }

    if ($iamUser -eq $null -or $iamUser -eq '') {
        $iamUser=((Read-Host -Prompt "IAM User [$env:UserName]") -replace '^$', $env:UserName)
    }

    if ($credentialFilePath -eq $null -or $credentialFilePath -eq '') {
        $credentialFilePath=((Read-Host -Prompt "credential path [$home\.aws\credentials]") -replace '^$', "$home\.aws\credentials")
    }

    if ($tokenLifetimeHours -eq $null -or $tokenLifetimeHours -eq '') {
        $tokenLifetimeHours=(Read-Host -Prompt "The time the token should be valid in hours (between 12 and 36) [12]")
    }

    if ($updateProfile -eq $null -or $updateProfile -eq '') {
        $updateProfile=((Read-Host -Prompt 'Update profile [default]') -replace '^$', 'default')
    }
}
if ($tokenCode -eq $null -or $tokenCode -eq '' -and $version -ne $true) {
    $tokenCode=(Read-Host -Prompt 'MFA Token Code' -MaskInput)
}

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
    ## # this token will expire at EXPIRATION
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


    $oldCredsFile = (Get-Content $credentialFilePath  -Encoding utf8NoBOM) -Join("¦")
    Write-Debug ("`noldCredsFile.Length = [{0}]`n{1}`n`n" -f $oldCredsFile.Length, $oldCredsFile)

    $credGroups = $oldCredsFile -split "\["

    Write-Verbose ("`nUpdating profile [$updateProfile]`n")
    [bool]$foundProfile = $false
    for ($ii=0; $ii -lt $credGroups.Length; $ii++){
        Write-Debug ("  Comparing <<{0}>>" -f $credGroups[$ii])
        Write-Debug ("    contains <<$updateProfile]>> = <<{0}>>" -f ($credGroups[$ii] -match ('^' + $updateProfile +'\]')))
        if ($credGroups[$ii] -match ('^' + $updateProfile +'\]')) {
            Write-Debug ("    replacing old value`n")
            $credGroups[$ii] = $newCreds
            $foundProfile = $true
        }
    }

    if ($foundProfile -eq $false) {
        Write-Verbose ("`n[$updateProfile] not found, creating a new profile`n")
        $credGroups[$credGroups.Length-1] += "¦[$newCreds"
    }

    Write-Debug ("`nprofile count [{0}]`nnew file content`n{1}`n" -f $credGroups.Length, ($credGroups -join "`n"))

    Write-Verbose ("`nWriting updated credentials file`n")
    # [string]$newCredentialFile = ($credGroups -Join("[")) -Replace "¦","`n"
    [string]$newCredentialFile = ($credGroups -Join("[")) -Replace "¦",[ENVIRONMENT]::NewLine
    Write-Debug ("`nFinal file update (length [{0}])`n{1}`n" -f $newCredentialFile.Length, $newCredentialFile)
    if ($whatIf -ne $true) {
        Set-Content -Path $credentialFilePath -Value $newCredentialFile -Encoding utf8NoBOM
    }
}

Write-Host -f Yellow ("`nThe AWS session token will expire at {0}`n" -f $credentials.Credentials.Expiration)
exit 0

<#
.SYNOPSIS
This program will use a valid aws user credential profile to create a temporary session token.

The program can also use to change/reset an AWS IAM account's password after generating a valid MFA token.

.DESCRIPTION
The AWS MFA Tool will ask for the information it needs to create temporary AWS session tokens from a valid user profile.
The needed information is defined in the parameter list, but it includes things like the AWS acconut, user profile, and multi-factor authentication (MFA) token.
The session token will be stored in enviroment variables, and be added to a specified profile in the AWS credentials file.  The following environment variables are created.
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN
- AWS_SESSION_EXPIRATION

.PARAMETER accountId
The AWS account to use for generating the session tokens.  This defaults to QSR's dev account.
.PARAMETER useProfile
The AWS profile to use to create the session tokens, this needs to be a valid user of the AWS Account specified in acconutId.  This defaults to "userdev".
.PARAMETER iamUser
The AWS user name indicated in the userProfile.  The default value is the user name of the person running the script.
.PARAMETER credentialFilePath
The path to the AWS credential file.  Defaults to "$home\.aws\credentials".
.PARAMETER tokenLifetimeHours
The length of time the session token should be valid.  Defaults to "12" hours, and can be up to 36 hours.
.PARAMETER updateProfile
This is the profile that will accept the temporary session token data.  A non-existing profile will get create and appended to the credentials file.  Defaults to "default".
.PARAMETER tokenCode
The multi-foctor authentication token.
.PARAMETER passwordUserName
The AWS IAM user name for which the password will be changed.  Defaults to the currently logged in user name.
.Parameter password
The password that will be set for the specified user name.
.PARAMETER region
Allows passing a different region in from the command line.  Defaults to "us-east-1".
.PARAMETER showResults
This flag will cause the new temporary session token to be displayed.
.PARAMETER noProfileUpdate
This flag causes the program to skip updating the credentials file profile update.
.PARAMETER version
This flag will cause the system to print the welcome message with the version and quit.
.PARAMETER defaults
This flag will cause the program to take the default value for the parameters and only ask for the MFA token.
.PARAMETER d
An alias flag for defaults
.PARAMETER changePassword
This flag switches to the change password mode, this mode will not generate a token.
.PARAMETER whatIf
The whatIf flag causes the program to run through the code without affecting any permanent changes.

.EXAMPLE
PS> .\aws_mfa_tool.ps1
- will allow the tool to ask for all information it needs and print out a welcome message and at a minimum the expiration time for the session token.  Some parameters will affect the output, such as "-version", "-Verbose", "-showResults".
.EXAMPLE
PS> .\aws_mfa_tool.ps1 -defaults
OR
PS> .\aws_mfa_tool.ps1 -d
- will take all the defualts, and ask for the MFA token
.EXAMPLE
PS> .\aws_mfa_tool.ps1 -d -tokenCode 123456
- will take all the defualts, and use the passed in mfa token so no further input is needed
.EXAMPLE
PS> .\aws_mfa_tool.ps1 -d -updateProfile qsrqa
- will take all the defualts except for the "updateProfile" parameter which will use the passed in value (the same pattern happens with the other parameters)
.EXAMPLE
PS> .\aws_mfa_tool.ps1 -version
- will display the welcome message with the version info
.EXAMPLE
PS> .\aws_mfa_tool.ps1 -changePassword
- will ask for the needed information to change the AWS IAM account password.
.EXAMPLE
PS> .\aws_mfa_tool.ps1 -changePassword -passwordUserName bferrapples -password Test1234
- will allow you to verify the password and confirm the change for the passed in account and password.
#>
