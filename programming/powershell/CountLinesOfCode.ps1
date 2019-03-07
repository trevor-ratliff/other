[CmdletBinding()]
####
# This script will count lines of code of the included file types in the directories indicated by the user.
# It will not count commented out lines (lines starting with '//', '/*' or '*') or blank lines
#
# Author: Trevor Ratliff
####

Param(
  [Parameter(Mandatory=$false, Position=1, HelpMessage={"Enter a path or paths (comma separated list) to search [" + $parametersPath + "]"})]
  [string[]]$ParameterFilePath,
  [Parameter(Mandatory=$false, Position=2, HelpMessage={"Enter any file types to include in the count [" + $parametersIncludes + "]"})]
  [string[]]$ParameterIncludeTypes,
  [Parameter(Mandatory=$false, HelpMessage={"Enter any file types to exclude in the count [" + $parametersExcludes + "]"})]
  [string[]]$ParameterExcludeTypes,
  [Parameter(Mandatory=$false, HelpMessage={"Enter any directories to exclude in the count [" + $parametersExcludePaths + "]"})]
  [string[]]$ParameterExcludedFolders,
  [string[]]$ParameterExcludeLinePatterns,
  [switch]$ShowProgress
)

[string[]]$parametersPath = @('.','.\*')
[string[]]$parametersIncludes = @('*.cs','*.js','*.css','*.less','*.htm','*.html')
[string[]]$parametersExcludes = @('*.designer.cs','*.min.js')
[string[]]$parametersExcludePaths = @('*\obj\*','*\bin\*','*\packages\*','*\node_modules\*','*\debug\*','*\release\*','*\dist\*')
[string[]]$_excludeLinePatterns = @("^(\s*)//","^(\s*)[/]?\*","^(\s*)$")
[long]$lineCount = 0

Write-Host ("`n`nThis utility will count lines of code")
Write-Debug (($ParameterFilePath -eq $null).ToString() +" | "+ ($ParameterExcludedFolders -eq $null).ToString())

if ($ParameterFilePath -eq $null) {$ParameterFilePath = $parametersPath}
if ($ParameterIncludeTypes -eq $null) {$ParameterIncludeTypes = $parametersIncludes}
if ($ParameterExcludeTypes -eq $null) {$ParameterExcludeTypes = $parametersExcludes}
if ($ParameterExcludedFolders -eq $null) {$ParameterExcludedFolders = $parametersExcludePaths}
if ($ParameterExcludeLinePatterns -eq $null) {$ParameterExcludeLinePatterns = $_excludeLinePatterns}

Write-Host "`nUsing the following values:`n  path: $ParameterFilePath`n  includes: $ParameterIncludeTypes`n  excludes: $ParameterExcludeTypes`n  exclude folders: $ParameterExcludedFolders`n  exclude line patterns: $ParameterExcludeLinePatterns"

####
# modified from https://stackoverflow.com/a/35993562
####

$files = Get-ChildItem $ParameterFilePath -Include $ParameterIncludeTypes -Exclude $ParameterExcludeTypes -Recurse | %{
  $allowed = $true
  foreach ($exclude in $ParameterExcludedFolders) {
    if ((Split-Path $_.FullName -Parent) -ilike $exclude) {
      Write-Verbose "  excluded path: $_.FullName"
      $allowed = $false
      break
    }
  }
  if ($allowed) {
    $_
  }
}

Write-Verbose ("`n`n$files.GetType(): "+ $files.GetType())
Write-Host ("`n`nFile Count: " + $files.Count)

foreach ($file in $files) {
  [long]$currLineCount = (
    $file |
    #Select-String "^(\s*)//" -notMatch |
    #Select-String "^(\s*)[/]?\*" -notMatch |
    #Select-String "^(\s*)$" -notMatch
    #Select-String "^(\s*)//","^(\s*)[/]?\*","^(\s*)$" -notMatch
    Select-String $ParameterExcludeLinePatterns -notMatch
    #Select-String "^.*$"
  ).count

  if ($ShowProgress) {
    Write-Host ("  " + $file.FullName + " - " + $currLineCount)
  }

  $lineCount += $currLineCount
}

Write-Host ("`n`nLines Of Code = $lineCount`n`nDone")
