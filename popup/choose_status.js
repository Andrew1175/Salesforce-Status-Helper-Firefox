var disableNotification = "disable-notification"
var backlogNotification = "backlog-notification"
var availableNotification = "available-notification"
var selectedsite;


function listenForClicks() {
	document.addEventListener("click", (e) => {

		/**
		* Replace Omni status with what's selected.
		*/
		function setStatus(statusName) {
			switch (statusName) {
				case "Available":
				return "Available";
				case "Backlog":
				return "Backlog";
			}
		}
		
		function pushStatus(tabs) {
			let status = setStatus(e.target.textContent);
			for (var i = 0; i < tabs.length; ++i) {
				if (status === "Backlog") {
					browser.tabs.sendMessage(tabs[i].id, {
						command: "Backlog"
					});
				} else if (status === "Available") {
					browser.tabs.sendMessage(tabs[i].id, {
						command: "Available"
					});
				}
			}
				
		}

		function disableHelper(tabs) {
			for (var i = 0; i < tabs.length; ++i) {
				browser.tabs.sendMessage(tabs[i].id, {
					command: "Disable"
				});
			}
        }

		function reportError(error) {
			console.error(`Could not set Omni-Channel status: ${error}`);
		}

		if (e.target.classList.contains("available")) {
			selectedsite = document.querySelector("#salesforcesite").value;
			if (selectedsite == "government") {
				selectedsite = "*://zscalergov.lightning.force.com/*"
			}
			else {
				selectedsite = "*://zscaler.lightning.force.com/*"
			}
			browser.tabs.query({
				url: selectedsite
			})
				.then(pushStatus)
				.catch(reportError);
		}
		else if (e.target.classList.contains("backlog")) {
			selectedsite = document.querySelector("#salesforcesite").value;
			if (selectedsite == "government") {
				selectedsite = "*://zscalergov.lightning.force.com/*";
			}
			else {
				selectedsite = "*://zscaler.lightning.force.com/*";
			}
			browser.tabs.query({
				url: selectedsite
			})
				.then(pushStatus)
				.catch(reportError);
		}
		else if (e.target.classList.contains("disable")) {
			selectedsite = document.querySelector("#salesforcesite").value;
			if (selectedsite == "government") {
				selectedsite = "*://zscalergov.lightning.force.com/*";
			}
			else {
				selectedsite = "*://zscaler.lightning.force.com/*";
			}
			browser.tabs.query({
				url: selectedsite
			})
				.then(disableHelper)
				.catch(reportError);
		}

	});
}

browser.tabs.executeScript({file: "/content_scripts/change_status.js"})
	.then(listenForClicks)

browser.runtime.onMessage.addListener((message) => {
	if (message.command === "disableNotification") {
		browser.notifications.create(disableNotification,{
			type: "basic",
			title: "Salesforce Status Helper",
			message: "Status Helper has been disabled"
		});
	}
	else if (message.command === "backlogNotification") {
		browser.notifications.create(backlogNotification,{
			type: "basic",
			title: "Salesforce Status Helper",
			message: "Your status has been updated to: Backlog"
		});
	}
	else if (message.command === "availableNotification") {
		browser.notifications.create(availableNotification,{
			type: "basic",
			title: "Salesforce Status Helper",
			message: "Your status has been updated to: Available"
		});
	}
});