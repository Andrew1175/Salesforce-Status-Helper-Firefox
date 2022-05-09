(function () {
	
	if (window.hasRun) {
    return;
  }
	window.hasRun = true;

	var backlogInterval;
	var availableInterval;
	var onlinestatus;
	var awaystatus;
	var evt;
	var str;
	var backlogstatus;
	var availableStatus;
	var statusBar;
	var dropDown;
	var clickBacklog;
	var clickAvailable;
	var clickstatusBar;
	var clickdropDown;
  
	function changeToBacklog() {
		try {
			awaystatus = document.getElementsByClassName("awayStatus truncatedText uiOutputText")[0].innerHTML;
		} catch {
			awaystatus = "placeholder";
        }
		if (awaystatus.includes("Backlog")) {
			console.log("Your status is already set to Backlog. Nothing else to do here.");
		}
		else if (awaystatus.includes("Web Case")) {
			console.log("You're currently on a case. Nothing else to do here.");
		}
		else {
			evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			str = document.getElementsByClassName("slds-dropdown__item awayStatus")[0];
			try {
				backlogstatus = str.getElementsByTagName("a")[0];
			} catch {
				dropDown = document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[6];
				clickdropDown = !dropDown.dispatchEvent(evt);
				alert("Omni-Channel error detected. Please try setting your status again.")
				backlogstatus = str.getElementsByTagName("a")[0];
			}
			clickBacklog = !backlogstatus.dispatchEvent(evt);
			browser.runtime.sendMessage({
				command: "backlogNotification"
			});
		}
	}

	function changeToAvailable() {
		try {
			onlinestatus = document.getElementsByClassName("onlineStatus truncatedText uiOutputText")[0].innerHTML;
		} catch {
			onlinestatus = "placeholder";
		}
		try {
			awaystatus = document.getElementsByClassName("awayStatus truncatedText uiOutputText")[0].innerHTML;
		} catch {
			awaystatus = "placeholder";
        }
		if (onlinestatus.includes("Available")) {
			console.log("Your status is already set to Available. Nothing else to do here.");
		}
		else if (awaystatus.includes("Web Case")) {
			console.log("You're currently on a case. Nothing else to do here.");
		}
		else {
			evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			str = document.getElementsByClassName("slds-dropdown__item onlineStatus")[0];
			try {
				availableStatus = str.getElementsByTagName("a")[0];
			} catch {
				dropDown = document.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[6];
				clickdropDown = !dropDown.dispatchEvent(evt);
				alert("Omni-Channel error detected. Please try setting your status again.")
				availableStatus = str.getElementsByTagName("a")[0];
            }
			clickAvailable = !availableStatus.dispatchEvent(evt);
			browser.runtime.sendMessage({
				command: "availableNotification"
			});
		}
	}
		
	function disableHelper() {
		clearInterval(backlogInterval);
		backlogInterval = null
		clearInterval(availableInterval);
		availableInterval = null
		browser.runtime.sendMessage({
			command: "disableNotification"
		});
	}
		
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "Backlog") {
			clearInterval(availableInterval);
			availableInterval = null
			clearInterval(backlogInterval);
			backlogInterval = null
			changeToBacklog()
			backlogInterval = setInterval(changeToBacklog, 15000);
			alert("You have set your Omni-Channel status to Backlog")
		}
		else if (message.command === "Available") {
			clearInterval(backlogInterval);
			backlogInterval = null
			clearInterval(availableInterval);
			availableInterval = null
			changeToAvailable()
			availableInterval = setInterval(changeToAvailable, 15000);
			alert("You have set your Omni-Channel status to Available")
		}
		else if (message.command === "Disable") {
			disableHelper();
			alert("You have disabled Salesforce Status Helper")
		}
	});
						
})();