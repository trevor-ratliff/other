[CmdletBinding()]
Param (
  [Parameter(Mandatory=$true, Position=1, HelpMessage="First manditory parameter")]
  [string]$test1,
  [Parameter(Mandatory=$true, Position=2, HelpMessage="Second manditory parameter")]
  [string]$test2,
  [string]$optional1=((Read-Host -Prompt "Optional Parameter 1 [optional1]") -replace "^$", "optional1"),
  [string]$optional2=$null,
  [switch]$doTwice,
  [string]$version="20171221.1"
)
Write-Verbose "getting value from user"
#$user1 = Read-Host -Prompt "Please enter the first user value"
$user1 = (Read-Host -Prompt "user Parameter 1 [user1]") -replace "^$", "user1"

Write-Verbose "setting test variable to see if optional variable 2 is null"

$test = $optional2 -eq $null
Write-Debug "$optional1, $test, $doTwice, $version"

Write-Verbose "seting _optional[1|2] to environment variables"
[string]$_optional1 = $env:BUILD_BUILDID
[string]$_optional2 = $env:BUILD_SOURCEVERSION
$_version = $version.Split('.')
[string]$versionPadding = ""

Write-Verbose "checking if optional[1|2] have values"
if ($optional1 -ne '') {
  $_optional1 = $optional1
}

if ($optional2 -ne '') {
  $_optional2 = $optional2
}

Write-Verbose "writting values`n`n"
Write-Host $test1 $test2 $user1 $_optional1 $_optional2 $version

if ($doTwice) {
  Write-Host $test1 $test2 $user1 $_optional1 $_optional2 $version `n
}

Write-Verbose "splitting up version data`n`n"
foreach ($part in $_version) {
  Write-Host $versionPadding$part
  $versionPadding += "_"
}
