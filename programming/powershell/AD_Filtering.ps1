[CmdletBinding()]
Param(
  [Parameter(Mandatory=$false, Position=1, HelpMessage={"Please enter an installation parameters file path [" + $parametersPath + "]"})]
  [string]$ParameterFilePath, #= ".\installationParameters.xml",
  [Parameter(Mandatory=$false, HelpMessage={"Please enter an LDAP path"})]
  [string]$LdapPath,
  [Parameter(Mandatory=$false, HelpMessage={"Please enter an LDAP filter"})]
  #TODO fix the rest of the prameters
  [string]$LdapFilter,
  [switch]$InstallAPI,
  [switch]$InstallDB,
  [switch]$InstallDocGenMicroService,
  [switch]$InstallHelp,
  [switch]$InstallMicroServices,
  [switch]$InstallReports,
  [switch]$InstallWebUI
)

#TODO not sure if we need a parameters file
[string]$parametersPath = ".\installationParameters.xml"

Write-Verbose ("$ParameterFilePath, $InstallAPI, $InstallWebUI, $InstallMicroServices`n")

Write-Host "`nWelcome to the AD filter test suite, where you can test various filters to find what works.`n"


####
# get parameter values if no parameter file
####
$params = @{"parameters" = @()}

if (1 -eq 2) {
    if ($ParameterFilePath -eq "") {
        Write-Host "Please fill in the required information before we continue."
        Write-Host "  using the name of a defined value later in the list will replace the current"
        Write-Host "    items value with the previously defined value."
        Write-Host ""
        Write-Host "  For example you define __Value1__ to be 'val1', then later you define"
        Write-Host "    __Value5__ as '__Value1__AndThis' the resultant value would be 'val1AndThis'`n`n"

        $params.parameters += @{"replace" = "__ENV__"; "with" = (Read-Host -Prompt "__ENV__: the environment indicator for this AgileCourt instance") -replace "^$", "__ENV__"}
        $params.parameters += @{"replace" = "__YOUR_DOMAIN__"; "with" = (Read-Host -Prompt "__YOUR_DOMAIN__: the domain for use in things like email addresses") -replace "^$", "__YOUR_DOMAIN__"}
        $params.parameters += @{"replace" = "__AGILECOURT_BASE_URL__"; "with" = (Read-Host -Prompt "__AGILECOURT_BASE_URL__: the base URL for the AgileCourt system") -replace "^$", "__AGILECOURT_BASE_URL__"}
        $params.parameters += @{"replace" = "__DB_SERVER_NAME__"; "with" = (Read-Host -Prompt "__DB_SERVER_NAME__: the database server name") -replace "^$", "__DB_SERVER_NAME__"}
        $params.parameters += @{"replace" = "__DB_INSTANCE_NAME__"; "with" = (Read-Host -Prompt "__DB_INSTANCE_NAME__: the database instance name if there is one") -replace "^$", "__DB_INSTANCE_NAME__"}
    } else {
        Write-Verbose ("pwd: " + $PWD)
        Write-Verbose ("Getting values from parameters file at '" + $ParameterFilePath + "'")

        [xml]$paramFile = Get-Content -Path $ParameterFilePath

        Write-Verbose "`n"
        foreach ($item in $paramFile.SelectNodes("parameters").SelectNodes("value")) {
            Write-Verbose ("replace '" + $item.replace + "' with '" + $item.with + "'")
            $params.parameters += @{"replace" = $item.replace; "with" = $item.with}
        }
    }
}


#TODO example of user led program control - modify this to change filter/ldap path/included properties etc.
if (!($InstallAPI -or $InstallWebUI -or $InstallMicroServices -or $InstallDB -or $InstallReports)) {
    Write-Verbose ("getting user choice for install`n")
    $choice01 = $null

    do {
        Write-Host "`nPlease choose what you would like to install:`n  1. AgileCourt API`n  2. AgileCourt Web Site`n  3. AgileCourt Microservices`n  4. AgileCourt Database`n  5. AgileCourt Reports"
        [int]$userInput01 = Read-Host -Prompt "choose 1 - 5" -ErrorAction Ignore
        if ($userInput01 -gt 0 -and $userInput01 -lt 4) {
            $choice01 = $userInput01
        }
    } until ($choice01 -ne $null)

    switch ($choice01) {
        1 {$choice01 = "AgileCourt API"; $InstallAPI = $true; Break}
        2 {$choice01 = "AgileCourt Web Site"; $InstallWebUI = $true; Break}
        3 {$choice01 = "AgileCourt Microservices"; $InstallMicroServices = $true; Break}
        4 {$choice01 = "AgileCourt Database"; $InstallDB = $true; Break}
        5 {$choice01 = "AglieCorut Reports"; $InstallReports = $true; Break}
    }

    Write-Verbose "`nInstalling $choice01"
}

#TODO this is an example of how to use the parameters - probably not going to use this 
if ($InstallDB) {
    Write-Host "`nInstalling AgileCourt Database"
    $dbDataSource = $params.parameters[-6].with

    #----
    # replace any placeholder strings
    #----
    for ($ii = -5; $ii -lt 0; $ii++) {
        #Write-Verbose ($ii.ToString() + "; " + $dbDataSource + "; " + $params.parameters[$ii].replace + "; " + $params.parameters[$ii].with)
        $dbDataSource = $dbDataSource -replace $params.parameters[$ii].replace, $params.parameters[$ii].with
    }

    Write-Verbose ("`n  using datasource '" + $dbDataSource + "'")
}

