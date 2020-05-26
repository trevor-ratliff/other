[CmdletBinding()]
####
# A script for quickly going through and removing remote branches of a GIT repository
#
# Parameter: numCharToRemove - will let you customize the number of characters to remove; defaults to 9
####

Param (
  [int]$numCharToRemove=((Read-Host -Prompt "String to remove from branch name string [7]") -replace "^$", 7),
  [switch]$test
)

Write-Host "This script will walk through all the remote branches of a GIT repository and ask if you want to remove it."
Write-Host "`n`n  The choices you will have are:"
Write-Host "    [y]es    - will remove the branch"
Write-Host "    [n]o     - will NOT remove the branch"
Write-Host "    [e]xamin - will display more info about the branch"
Write-Host "    [q]uit   - will stop the script"

Foreach ($b in (git branch -r))
{
    $b = $b.Trim()
    $choice = $null

    do {
        Write-Verbose "`nGetting users choice for removing '$b'`n"
        [string]$userInput = Read-Host -Prompt "`nDo you want to remove '$b'? [y|n|e|q]" -ErrorAction Ignore
        if ($userInput -in ('e','n','q','y')) {
            $choice = $userInput
            if ($userInput -eq 'e') {
                git show --format=fuller $b
                $choice = $null
            }
        }

        Write-Verbose "`n  User's choice: $userInput"
    } until ($choice -ne $null)

    if ($choice -eq 'y') {
        Write-Verbose "`n  Removing '$b'`n"

        if ($test) {
            git push origin --dry-run --delete $b.Substring($numCharToRemove)
        } else {
            git push origin --delete $b.Substring($numCharToRemove)
        }
    }

    if ($choice -eq 'q') {
        Break
    }
}

exit 0
