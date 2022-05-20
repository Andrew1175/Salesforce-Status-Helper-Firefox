(function () {
	
	if (window.hasRun) {
    return;
  }
	window.hasRun = true;

	var backlogInterval;
	var availableInterval;
	var refreshInterval;
	var onlinestatus;
	var awaystatus;
	var str;
	var OmniChannelElement;
	var StatusDropdownButton;
	var OmniSuperAction;
  
	function changeToBacklog() {
		try {
			awaystatus = document.getElementsByClassName("awayStatus truncatedText uiOutputText")[0].innerHTML;
		}
		catch {
			awaystatus = "placeholder";
        }
		if (awaystatus.includes("Backlog")) {
			console.log("Your status is already set to Backlog. Nothing else to do here.");
		}
		else if (awaystatus.includes("Web Case")) {
			console.log("You're currently on a case. Nothing else to do here.");
		}
		else {
			try {
				str = document.getElementsByClassName("slds-dropdown__item awayStatus")[0];
				var backlogstatus = str.getElementsByTagName("a")[0].click();
				browser.runtime.sendMessage({
					command: "backlogNotification"
				});
			}
			catch (error) {
				alert("Omni-Channel error detected. Please check console for the detailed error");
				console.log("Unable to set status to Backlog due to:", error);
				console.log("Attempting to fix...");
				try {
					OmniChannelElement = document.getElementsByClassName("runtime_service_omnichannelStatus runtime_service_omnichannelOmniWidget")[0];
					StatusDropdownButton = OmniChannelElement.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[0];
					StatusDropdownButton.click();
					StatusDropdownButton.click();
					console.log("Omni-Channel has been fixed. Status will change to Backlog at the next health check.");
				}
				catch (error) {
					console.log("Unable to fix Omni-Channel due to:", error);
					console.log("Please manually set your status to fix the issue");
                }
			}
		}
	}

	function changeToAvailable() {
		try {
			onlinestatus = document.getElementsByClassName("onlineStatus truncatedText uiOutputText")[0].innerHTML;
		}
		catch {
			onlinestatus = "placeholder";
		}
		try {
			awaystatus = document.getElementsByClassName("awayStatus truncatedText uiOutputText")[0].innerHTML;
		}
		catch (error){
			awaystatus = "placeholder";
        }
		if (onlinestatus.includes("Available")) {
			console.log("Your status is already set to Available. Nothing else to do here.");
		}
		else if (awaystatus.includes("Web Case")) {
			console.log("You're currently on a case. Nothing else to do here.");
		}
		else {
			try {
				str = document.getElementsByClassName("slds-dropdown__item onlineStatus")[0];
				var availableStatus = str.getElementsByTagName("a")[0].click();
				browser.runtime.sendMessage({
					command: "availableNotification"
				});
			}
			catch (error) {
				console.log("Unable to set status to Available. Reason:");
				console.log(error);
				console.log("Attempting to fix...");
				alert("Omni-Channel error detected. Please check console for the detailed error");
				try {
					OmniChannelElement = document.getElementsByClassName("runtime_service_omnichannelStatus runtime_service_omnichannelOmniWidget")[0];
					StatusDropdownButton = OmniChannelElement.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[0];
					StatusDropdownButton.click();
					StatusDropdownButton.click();
					console.log("Omni-Channel has been fixed. Status will change to Available at the next health check.");
				}
				catch (error) {
					console.log("Unable to fix Omni-Channel due to:", error);
					console.log("Please manually set your status to fix the issue");
				}
			}
		}
	}
		
	function disableHelper() {
		clearInterval(backlogInterval);
		backlogInterval = null;
		clearInterval(availableInterval);
		availableInterval = null;
		clearInterval(refreshInterval);
		refreshInterval = null;
		browser.runtime.sendMessage({
			command: "disableNotification"
		});
	}

	
	function refreshOmni() {
		try {
			OmniSuperAction = document.querySelector("[title='Actions for Omni Supervisor']");
			var OmniSuperRefreshButton = OmniSuperAction.getElementsByClassName("slds-truncate")[0].click();
			console.log("Omni Supervisor was successfully refreshed.");
		}
		catch (error) {
			console.log("Omni Supervisor was not detected. Reference the following error:");
			console.log(error);
			console.log("Attempting to correct...");
			try {
				OmniSuperAction = document.querySelector("[title='Actions for Omni Supervisor']");
				var OmniSuperDropdownButton = OmniSuperAction.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[0];
				OmniSuperDropdownButton.click();
				OmniSuperDropdownButton.click();
				console.log("Error corrected. Omni Supervisor will refresh on the next interval.");

			}
			catch (error) {
				console.log("Could not correct error due to:", error);
				cosole.log("Please be sure Omni Supervisor is open within Salesforce.");
            }
		}
	}
		
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "Backlog") {
			alert("You have set your Omni-Channel status to Backlog");
			clearInterval(availableInterval);
			availableInterval = null;
			clearInterval(backlogInterval);
			backlogInterval = null;
			clearInterval(refreshInterval);
			refreshInterval = null;
			changeToBacklog();
			backlogInterval = setInterval(changeToBacklog, 15000);
			refreshInterval = setInterval(refreshOmni, 60000);
		}
		else if (message.command === "Available") {
			alert("You have set your Omni-Channel status to Available");
			clearInterval(backlogInterval);
			backlogInterval = null;
			clearInterval(availableInterval);
			availableInterval = null;
			clearInterval(refreshInterval);
			refreshInterval = null;
			changeToAvailable();
			availableInterval = setInterval(changeToAvailable, 15000);
			refreshInterval = setInterval(refreshOmni, 60000);
		}
		else if (message.command === "Disable") {
			alert("You have disabled Salesforce Status Helper");
			disableHelper();
		}
	});
						
})();