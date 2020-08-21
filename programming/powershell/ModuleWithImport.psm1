[CmdletBinding()]

####
# This script aranges files for creating deployment packages, and bundles them up.DESCRIPTION
#   It also stores the previously bundled packages up to the $UpperBound value
####
Import-Module Microsoft.PowerShell.Archive -DisableNameChecking

#[CmdletBinding()]

Param(
  [Parameter(Mandatory=$true, Position=1)]
  [string]$WorkingPath,
  [Parameter(Mandatory=$true, Position=2)]
  [string]$DistPath,
  [int]$UpperBound,
  [switch]$WhatIf
)

Write-Verbose "$WorkingPath, $DistPath, $UpperBound, $Whatif"
