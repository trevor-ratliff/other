# You'll need the powertools for TFS.  2015 version is at https://marketplace.visualstudio.com/items?itemName=TFSPowerToolsTeam.MicrosoftVisualStudioTeamFoundationServer2015Power
#############################################################
#
# Description: Automatically creates standard Tasks
#              in TFS for a given story.
#
# Created:     2/7/2017
#
#############################################################
[CmdletBinding()]
Param(
    [Parameter(Mandatory=$true, Position=1, HelpMessage="URL path to TFS (up to 'tfs')")]
	[string]$tfsInstancePath,

	[Parameter(Mandatory=$true, Position=1, HelpMessage="TFS collection name")]
	[string]$tfsInstanceCollection,

    [Parameter(Mandatory=$true, Position=1, HelpMessage="TFS project")]
	[string]$tfsInstanceProject,

    [Parameter(Mandatory=$true, Position=2, HelpMessage="WorkItem number to add standard tasks to")]
    [string]$storyNumber
)

# Clear Output Pane
#clear

# setup some constants
#[string] $tfsServerUrl = http://[YourServer]/tfs/[YourCollection]
[string] $tfsServerUrl = "$tfsInstancePath/$tfsInstanceCollection"

#[string] $projectName = "[YourProject]"
[string] $projectName = $tfsInstanceProject

# Loads Windows PowerShell snap-in and related assemblies if not already loaded
if ( (Get-PSSnapin -Name Microsoft.TeamFoundation.PowerShell -ErrorAction SilentlyContinue) -eq $null )
{
    Add-PSSnapin Microsoft.TeamFoundation.PowerShell
}

[void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.TeamFoundation.Client")
[void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.TeamFoundation.Build.Client")
[void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.TeamFoundation.Build.Common")
[void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.TeamFoundation.WorkItemTracking.Client")

function AddTask($workItemStore, $taskType, $story, $title, $activity, $hours)
{
    $task = New-Object Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItem -ArgumentList $taskType
    $task.Title = $title
    $task.AreaId = $story.AreaId
    $task.IterationId = $story.IterationId
    $task["Activity"] = $activity
    $task["Remaining Work"] = $hours
    $task.Save()

    $linkType = $workItemStore.WorkItemLinkTypes[[Microsoft.TeamFoundation.WorkItemTracking.Client.CoreLinkTypeReferenceNames]::Hierarchy]
    $link = new-object Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemLink($linkType.ReverseEnd, $story.ID)
    $result = $task.Links.Add($link)
    $task.Save()
    Write-Host $title " task created."
}

# get the TFS collection
$collection = [Microsoft.TeamFoundation.Client.TfsTeamProjectCollectionFactory]::GetTeamProjectCollection($tfsServerUrl)

# get the workitem store
$workitemStore = $collection.GetService([type]"Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemStore")

# get the team project
$project = $workitemStore.Projects[$projectName]

# get the story
$story = $workItemStore.GetWorkItem($storyNumber)

# get the task task type
[Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemType]$featureType = [Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemType]$project.WorkItemTypes["Feature"]
[Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemType]$storyType = [Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemType]$project.WorkItemTypes["User Story"]
[Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemType]$taskType = [Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemType]$project.WorkItemTypes["Task"]

# Add the tasks.
Write-Host "Adding boilerplate to Story " $story.Id " - " $story.Title
AddTask $workitemStore $taskType $story "Research" "Your Activity" YourHours
AddTask $workitemStore $taskType $story "Review" "Your Activity" YourHours
AddTask $workitemStore $taskType $story "Implement" "Your Activity" YourHours
AddTask $workitemStore $taskType $story "Code Review" "Your Activity" YourHours
AddTask $workitemStore $taskType $story "Document" "Your Activity" YourHours
AddTask $workitemStore $taskType $story "Testing" "Your Activity" YourHours

