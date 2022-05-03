(function () {
	
	if (window.hasRun) {
    return;
  }
	window.hasRun = true;

	var backlogInterval;
	var availableInterval;
  
	function changeToBacklog() {
		var currentstatus = document.getElementsByClassName("awayStatus truncatedText uiOutputText")[0].innerHTML;
		if (currentstatus.includes("Backlog")) {
			console.log("Your status is already set to Backlog. Nothing else to do here.");
		}
		else {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			var str = document.getElementsByClassName("slds-dropdown__item awayStatus")[0];
			var backlogstatus = str.getElementsByTagName("a")[0];
			var canceled = !backlogstatus.dispatchEvent(evt);
			console.log("Status changed to Backlog Successfully");
		}
	}

	function changeToAvailable() {
		var currentstatus = document.getElementsByClassName("onlineStatus truncatedText uiOutputText")[0].innerHTML;
		if (currentstatus.includes("Available")) {
			console.log("Your status is already set to Available. Nothing else to do here.");
		}
		else {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			var str = document.getElementsByClassName("slds-dropdown__item onlineStatus")[0];
			var backlogstatus = str.getElementsByTagName("a")[0];
			var canceled = !backlogstatus.dispatchEvent(evt);
			console.log("Status changed to Available");
		}
	}
		
	function disableHelper() {
		clearInterval(backlogInterval);
		backlogInterval = null
		clearInterval(availableInterval);
		availableInterval = null
		console.log("Salesforce Status Helper has been disabled");
	}
		
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "Backlog") {
			clearInterval(availableInterval);
			availableInterval = null
			changeToBacklog()
			backlogInterval = setInterval(changeToBacklog, 15000);
		}
		else if (message.command === "Available") {
			clearInterval(backlogInterval);
			backlogInterval = null
			changeToAvailable()
			availableInterval = setInterval(changeToAvailable, 15000);
		}
		else if (message.command === "Disable") {
			disableHelper();
		}
	});
						
})();