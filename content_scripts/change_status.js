(function () {
	
	if (window.hasRun) {
    return;
  }
	window.hasRun = true;
  
	function changeToBacklog() {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window,
		0, 0, 0, 0, 0, false, false, false, false, 0, null);
		var str = document.getElementsByClassName("slds-dropdown__item awayStatus")[0];
		var backlogstatus = str.getElementsByTagName("a")[0];
		var canceled = !backlogstatus.dispatchEvent(evt);
		console.log("Status changed to Backlog Successfully")
	}
		
	function disableHelper(){
		console.log("Salesforce Status Helper has been disabled")
	}
		
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "Backlog") {
		changeToBacklog();
		} else if (message.command === "Disable") {
		disableHelper();
		}
	});
						
})();