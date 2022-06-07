(function () {

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    var backlogInterval;
    var availableInterval;
    var refreshInterval;
    var autoQueueInterval;
    var OmniChannelElement = document.getElementsByClassName("runtime_service_omnichannelStatus runtime_service_omnichannelOmniWidget")[0];
    var CurrentStatus = OmniChannelElement.getElementsByTagName("span")[0].innerHTML;
    var StatusDropdownButton = OmniChannelElement.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[0];
    StatusDropdownButton.click();
    StatusDropdownButton.click();
    var BacklogDropdownElement = OmniChannelElement.getElementsByClassName("slds-dropdown__item awayStatus")[0];
    var BacklogStatusButton = BacklogDropdownElement.getElementsByTagName("a")[0];
    var AvailableDropdownElement = OmniChannelElement.getElementsByClassName("slds-dropdown__item onlineStatus")[0];
    var AvailableStatusButton = AvailableDropdownElement.getElementsByTagName("a")[0];
    var OfflineDropdownElement = OmniChannelElement.getElementsByClassName("slds-dropdown__item offlineStatus")[0];
    var OfflineStatusButton = OfflineDropdownElement.getElementsByTagName("a")[0];
    var OmniSuperAction;

    function changeToBacklog() {
        try {
            CurrentStatus = OmniChannelElement.getElementsByTagName("span")[0].innerHTML;
        }
        catch {
            CurrentStatus = "placeholder";
        }
        if (CurrentStatus.includes("Backlog")) {
            console.log("Your status is already set to Backlog. Nothing else to do here.");
        }
        else if (CurrentStatus.includes("Web Case")) {
            console.log("You're currently on a case. Nothing else to do here.");
        }
        else {
            try {
                BacklogStatusButton.click();
                browser.runtime.sendMessage({
                    command: "backlogNotification"
                });
            }
            catch (error) {
                alert("Omni-Channel error detected. Please check console for the detailed error");
                console.log("Unable to set status to Backlog due to:", error);
                console.log("Attempting to fix...");
                try {
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
            CurrentStatus = OmniChannelElement.getElementsByTagName("span")[0].innerHTML;
        }
        catch {
            CurrentStatus = "placeholder";
        }
        if (CurrentStatus.includes("Available")) {
            console.log("Your status is already set to Available. Nothing else to do here.");
        }
        else if (CurrentStatus.includes("Web Case")) {
            console.log("You're currently on a case. Nothing else to do here.");
        }
        else {
            try {
                AvailableStatusButton.click();
                browser.runtime.sendMessage({
                    command: "availableNotification"
                });
            }
            catch (error) {
                alert("Omni-Channel error detected. Please check console for the detailed error");
                console.log("Unable to set status to Available due to:", error);
                console.log("Attempting to fix...");
                try {
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

    function changeToOffline() {
        try {
            OfflineStatusButton.click();
            browser.runtime.sendMessage({
                command: "offlineNotification"
            });
        }
        catch (error) {
            alert("Omni-Channel error detected. Please check console for the detailed error");
            console.log("Unable to set status to Offline due to:", error);
            console.log("Attempting to fix...");
            try {
                StatusDropdownButton.click();
                StatusDropdownButton.click();
                console.log("Omni-Channel has been fixed. Status will change to Offline at the next health check.");
            }
            catch (error) {
                console.log("Unable to fix Omni-Channel due to:", error);
                console.log("Please manually set your status to fix the issue");
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
        clearInterval(autoQueueInterval);
        autoQueueInterval = null;
        browser.runtime.sendMessage({
            command: "disableNotification"
        });
    }

    function disableAutoQueue() {
        clearInterval(backlogInterval);
        backlogInterval = null;
        clearInterval(availableInterval);
        availableInterval = null;
        clearInterval(refreshInterval);
        refreshInterval = null;
        clearInterval(autoQueueInterval);
        autoQueueInterval = null;
        console.log("Automated Queue has been disabled")
    }


    function refreshOmni() {
        try {
            OmniSuperAction = document.querySelector("[title='Actions for Omni Supervisor']");
            var OmniSuperRefreshButton = OmniSuperAction.getElementsByClassName("slds-truncate")[0].click();
            console.log("Omni Supervisor was successfully refreshed.");
        }
        catch (error) {
            console.log("Omni Supervisor was not detected due to", error);
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

    function autoQueueCheck() {
        browser.storage.sync.get({
            savedStartShift: "08:00 PM",
            savedEndShift: "08:00 PM",
            savedFirstShiftStart: "08:00 PM",
            savedFirstShiftEnd: "08:00 PM",
            savedSecondShiftStart: "08:00 PM",
            savedSecondShiftEnd: "08:00 PM"
        }, function (items) {
            var currentTime = new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            if (items.savedFirstShiftStart <= currentTime && items.savedFirstShiftEnd >= currentTime) {
                changeToAvailable();
            }
            else if (items.savedSecondShiftStart <= currentTime && items.savedSecondShiftEnd >= currentTime) {
                changeToAvailable();
            }
            else if (items.savedStartShift <= currentTime && items.savedEndShift >= currentTime) {
                changeToBacklog();
            }
            else {
                changeToOffline();
                disableAutoQueue();
            }
        });
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
            clearInterval(autoQueueInterval);
            autoQueueInterval = null;
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
            clearInterval(autoQueueInterval);
            autoQueueInterval = null;
            changeToAvailable();
            availableInterval = setInterval(changeToAvailable, 15000);
            refreshInterval = setInterval(refreshOmni, 60000);
        }
        else if (message.command === "Disable") {
            alert("You have disabled Salesforce Status Helper");
            disableHelper();
        }
        else if (message.command === "enableAutoQueue") {
            clearInterval(backlogInterval);
            backlogInterval = null;
            clearInterval(availableInterval);
            availableInterval = null;
            clearInterval(refreshInterval);
            refreshInterval = null;
            clearInterval(autoQueueInterval);
            autoQueueInterval = null;
            autoQueueCheck();
            autoQueueInterval = setInterval(autoQueueCheck, 15000);
            refreshInterval = setInterval(refreshOmni, 60000);
            console.log("Automated Queue has been enabled");
        }
        else if (message.command === "disableAutoQueue") {
            disableAutoQueue();
        }
    });

})();