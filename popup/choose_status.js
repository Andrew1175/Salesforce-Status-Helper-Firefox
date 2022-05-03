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

		if (e.target.classList.contains("status")) {
			browser.tabs.query({})
				.then(pushStatus)
				.catch(reportError);
		}
		else if (e.target.classList.contains("disable")) {
			browser.tabs.query({})
				.then(disableHelper)
				.catch(reportError);
		}

	});
}

browser.tabs.executeScript({file: "/content_scripts/change_status.js"})
.then(listenForClicks)