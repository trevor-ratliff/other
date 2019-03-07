[CmdletBinding()]

Param(
  [Parameter(Mandatory=$false, Position=1, HelpMessage={"Please enter a SSRS service URL"})]
  [string]$url = ((Read-Host -Prompt "Enter the SSRS service url [https://ssrs.gs.acs-inc.com/ReportServer_SQL2014/reportservice2010.asmx]") -replace "^$", "https://ssrs.gs.acs-inc.com/ReportServer_SQL2014/reportservice2010.asmx"),
  [Parameter(Mandatory=$false, Position=2, HelpMessage={"Please enter an SSRS report folder path starting with a '/'"})]
  [string]$reportFolderPath = ((Read-Host -Prompt "Enter the report folder path starting with a '/' [/Staging/Reports]") -replace "^$", "/Staging/Reports"),
  [string]$newDataSourceName = ((Read-Host -Prompt "Enter the new datasource's name [DataSourceAC8x]") -replace "^$", "DataSourceAC8x"),
  [string]$newDataSourcePath = ((Read-Host -Prompt "Enter the new datasource's path - starting with a '/' [/Staging/DataSources/DataSourceAC8x]") -replace "^$", "/Staging/DataSources/DataSourceAC8x")
)

CLS

function Get-ReportList (
  [Parameter(Mandatory=$true, HelpMessage={"Please enter a SSRS service URL"})]
  [string]$url,
  [Parameter(Mandatory=$true, HelpMessage={"Please enter an SSRS report folder path"})]
  [string]$reportFolderPath,
  [Parameter(Mandatory=$true, HelpMessage={"Please enter a new datasource name"})]
  [string]$newDataSourceName,
  [Parameter(Mandatory=$true, HelpMessage={"Please enter a new datasource path"})]
  [string]$newDataSourcePath
)
{

    Write-Verbose "url: $url"
    Write-Verbose "Report Folder Path: $reportFolderPath"
    Write-Verbose "new datasource name: $newDataSourceName"
    Write-Verbose "new datasource path: $newDataSourcePath"

    $success = $false
    $ssrs = $null
    do {
        try {
            $cred = Get-Credential -Message "Enter SSRS credential"
            if (!$cred) { exit }

            $ssrs = New-WebServiceProxy -uri $url -Credential $cred
            $success = $ssrs -ne $null
        } catch [WebException] {
            "Error authenticating, try again."
        }
    } while ($success -eq $false)

    $reports = $ssrs.ListChildren($reportFolderPath, $true)				  #Load all the report locations in to memory
	$reports | ForEach-Object {
		if ($_.TypeName -eq "Report") {
            Write-Verbose ("Report: " + $_.Name +";") -Verbose
		}
	}

}

Write-Verbose ("`nEntered values:`n  url: $url`n  report folder path: $reportFolderPath`n  newDataSourceName: $newDataSourceName`n  newDataSourcePath: $newDataSourcePath`n`n") -Verbose

Get-ReportList -url $url -reportFolderPath $reportFolderPath -newDataSourceName $newDataSourceName -newDataSourcePath $newDataSourcePath
