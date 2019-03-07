$IISFolderPath = "C:\AgileCourtWebRoot\WebUI"
$WebUISiteName = "agilecourt-ui"
$ProxyFolderName = "apiurl"
$APIAppPath = "IIS:\Sites\"+$WebUISiteName+"\"+$ProxyFolderName
$RewriteApiURL = "http://localhost:8887/{R:1}"
#
        # Delete the web application if it exists already from previous installation
        #
        if (Get-WebApplication -Name $ProxyFolderName)
        {
            Remove-WebApplication -Name $ProxyFolderName -Site $WebUISiteName
            rd -Path $IISFolderPath\$ProxyFolderName -Recurse
            Start-Sleep -Milliseconds 100
        }
        #
        # Create the directory
        #
        Md $IISFolderPath\$ProxyFolderName
        #
        # CONVERT TO APPLICATION AND SET APPLICATION POOL IDENTITY
        #
        ConvertTo-WebApplication -pspath $APIAppPath -ApplicationPool $WebUISiteName
        #
        # CREATE REWRITE RULE - CREATES WEB.CONFIG IN APPURL DIR
        #
        Add-WebConfigurationProperty -pspath $APIAppPath -filter "system.webServer/rewrite/rules" -name "." -value @{name='Rewrite API URL'}
        #
        # CREATE WEB.CONFIG ENTRY TO MATCH ON (.*)
        #
        Set-WebConfigurationProperty -pspath $APIAppPath -filter "system.webServer/rewrite/rules/rule[@name='Rewrite API URL']/match" -name "url" -value "(.*)"
        #
        # ADD WEB.CONFIG ENTRY TO SPECIFY REWRITE ACTION
        #
        Set-WebConfigurationProperty -pspath $APIAppPath -filter "system.webServer/rewrite/rules/rule[@name='Rewrite API URL']/action" -name "type" -value "Rewrite"
        #
        # ADD WEB.CONFIG ENTRY TO SPECIFY THE URL TO REWRITE TO
        #
        Set-WebConfigurationProperty -pspath $APIAppPath -filter "system.webServer/rewrite/rules/rule[@name='Rewrite API URL']/action" -name "url" -value $RewriteApiURL

		#
		# add system.web/httpRuntime - this is a required value if system.web is included it seems
		#
		Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web" -Name "httpRuntime" -Type element -Value @{targetFrameWork='4.6'; maxUrlLength='1024'; maxRequestLength='51200'}

		#
		# add a section to remove handlers for the reporting services dlls
		#    <add assembly="Microsoft.ReportViewer.Common, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#    <add assembly="Microsoft.ReportViewer.DataVisualization, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#    <add assembly="Microsoft.ReportViewer.Design, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#    <add assembly="Microsoft.ReportViewer.ProcessingObjectModel, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#    <add assembly="Microsoft.ReportViewer.WebDesign, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#    <add assembly="Microsoft.ReportViewer.WebForms, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#    <add assembly="Microsoft.ReportViewer.WinForms, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
		#
		# the following line may be too extream 
		add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation" -Name "assemblies" -value @{assembly='removal'; name='bob'}
        Remove-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies" -Name "." -AtIndex 1
		#clear-WebConfiguration -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/add"

		# but using specifics makes it hard if we update the assemblies without fixing these references
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.Common, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.DataVisualization, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.Design, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.ProcessingObjectModel, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.WebDesign, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.WebForms, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
		#Add-WebConfigurationProperty -PSPath $APIAppPath -Filter "system.web/compilation/assemblies/remove" -Name "." -Value @{assembly='Microsoft.ReportViewer.WinForms, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91'}
