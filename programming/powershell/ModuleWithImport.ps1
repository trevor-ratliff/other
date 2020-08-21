####
# This script is for testing out how to arange the [CmdletBinding()] and the Import-Module commands
####

[CmdletBinding()]
Param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$WorkingPath,
  [Parameter(Mandatory=$true, Position=2)]
  [string]$DistPath,
  [int]$UpperBound,
  [switch]$WhatIf
)

$_hasArchive = $null

try {
    Import-Module Microsoft.PowerShell.Archive -DisableNameChecking
    $_hasArchive = $true
} catch {
    Write-Verbose "Will not be able to archive the deployment" -Verbose
}

Write-Verbose "$WorkingPath, $DistPath, $UpperBound, $Whatif, $_hasArchive" -Verbose
