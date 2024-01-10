(function () {

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    var backlogInterval;
    var availableInterval;
    var refreshInterval;
    var autoQueueInterval;
    var errorCheckInterval;
    var OmniSuperAction;

    function getInitialVariables() {
        try {
            console.log("Attempting to load elements from DOM");
            window.OmniChannelElement = document.getElementsByClassName("runtime_service_omnichannelStatus")[0];
            window.CurrentStatus = OmniChannelElement.getElementsByTagName("span")[2].innerHTML;
            window.StatusDropdownButton = OmniChannelElement.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[0];
            window.globalHeader = document.getElementsByClassName("slds-global-header slds-grid slds-grid--align-spread")[0];
        } catch (error) {
            console.log("DOM hasn't completely loaded with error (" + error + ") Trying again every 1 second");
            setTimeout(getInitialVariables, 1000)
            return;
        }
        if (OmniChannelElement == null || CurrentStatus == null || StatusDropdownButton == null) {
            setTimeout(getInitialVariables, 1000);
            console.log("Some elements are missing. Trying again every 1 second");
            return;
        }
        else {
            StatusDropdownButton.click();
            StatusDropdownButton.click();
            try {
                console.log("Attempting to load Omni-Channel Statuses");
                window.BacklogDropdownElement = OmniChannelElement.getElementsByClassName("slds-dropdown__item awayStatus")[0];
                window.BacklogStatusButton = BacklogDropdownElement.getElementsByTagName("a")[0];
                window.AvailableDropdownElement = OmniChannelElement.getElementsByClassName("slds-dropdown__item onlineStatus")[0];
                window.AvailableStatusButton = AvailableDropdownElement.getElementsByTagName("a")[0];
                window.OfflineDropdownElement = OmniChannelElement.getElementsByClassName("slds-dropdown__item offlineStatus")[0];
                window.OfflineStatusButton = OfflineDropdownElement.getElementsByTagName("a")[0];
            } catch (error) {
                console.log("Statuses were unable to load with error (" + error + ") Trying again every 1 second");
                setTimeout(getInitialVariables, 1000);
                return;
            }
            console.log("All elements were loaded");
            window.SFSHStatusDiv = document.createElement('div');
            SFSHStatusDiv.id = 'SHSHActivityText';
            SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: Disabled';
            SFSHStatusDiv.setAttribute('align', 'center');
            SFSHStatusDiv.style.fontSize = "medium";
            SFSHStatusDiv.style.backgroundColor = "#6495ED";
            globalHeader.insertAdjacentElement('beforebegin', SFSHStatusDiv);
            browser.runtime.sendMessage({
                command: "allVariablesLoaded"
            });
        }
    }

    getInitialVariables();

    function changeToBacklog() {
        try {
            CurrentStatus = OmniChannelElement.getElementsByTagName("span")[2].innerHTML;
        }
        catch {
            CurrentStatus = "placeholder";
        }
        if (CurrentStatus.includes("Backlog")) {
            null;
        }
        else if (CurrentStatus.includes("Web Case")) {
            null;
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
            CurrentStatus = OmniChannelElement.getElementsByTagName("span")[2].innerHTML;
        }
        catch {
            CurrentStatus = "placeholder";
        }
        if (CurrentStatus.includes("Available")) {
            null;
        }
        else if (CurrentStatus.includes("Web Case")) {
            null;
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
            CurrentStatus = OmniChannelElement.getElementsByTagName("span")[2].innerHTML;
        }
        catch {
            CurrentStatus = "placeholder";
        }
        if (CurrentStatus.includes("Offline")) {
            null;
        }
        else if (CurrentStatus.includes("Web Case")) {
            null;
        }
        else {
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
        clearInterval(errorCheckInterval);
        errorCheckInterval = null;
        SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: Disabled';
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
        clearInterval(errorCheckInterval);
        errorCheckInterval = null;
        SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: Disabled';
        browser.runtime.sendMessage({
            command: "autoQueueDisabled"
        });
    }

    function caseCheck() {
        var userTabs = document.getElementsByClassName('tabBarItems slds-grid')[0];
        var caseTabs = userTabs.querySelectorAll("[title*='000'][role='tab']");
        if (caseTabs.length > 0) {
            for (let i = 0; i < caseTabs.length; i++) {
                if (caseTabs[i].getAttribute("aria-selected") == "true") {
                    activeCase = "true";
                    break;
                } else {
                    activeCase = "false";
                }
            }
            if (activeCase == "false") {
                refreshOmni();
            } else {
                return;
            }
        } else {
            refreshOmni();
        }
    }

    function refreshOmni() {
        try {
            OmniSuperAction = document.querySelector("[title='Actions for Omni Supervisor']");
            OmniSuperAction.getElementsByClassName("slds-truncate")[0].click();
        }
        catch (error) {
            console.log("Omni Supervisor was not detected due to", error);
            console.log("Attempting to correct...");
            try {
                OmniSuperAction = document.querySelector("[title='Actions for Omni Supervisor']");
                var OmniSuperDropdownButton = OmniSuperAction.getElementsByClassName("slds-button slds-button_icon-container slds-button_icon-x-small")[0];
                OmniSuperDropdownButton.click();
                OmniSuperDropdownButton.click();
                console.log("Error corrected.");

            }
            catch (error) {
                console.log("Could not correct error due to:", error);
                console.log("Please be sure Omni Supervisor is open within Salesforce.");
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
                changeToOffline()
                //normally this would be changeToBacklog() but the queue system is configured incorrectly and causing case balancing issues
            }
            else {
                changeToOffline();
                disableAutoQueue();
            }
        });
    }

    function errorCheck() {
        try {
            var omniErrorBox = document.getElementsByClassName("message-box runtime_service_omnichannelMessage runtime_service_omnichannelOmniWidget")[0];
            var omniErrorMessage = omniErrorBox.getElementsByClassName("slds-col slds-align-middle")[0].innerHTML;
        } catch {
            omniErrorMessage = "none";
        }
        if (omniErrorMessage == "none" || omniErrorMessage.includes("no active requests")) {
            null;
        }
        else {
            console.log("Omni-Channel connection issue detected. Waiting 30 seconds to see if connection can re-establish.");
            setTimeout(errorCheckResolved, 30000);
        }
    }

    function errorCheckResolved() {
        try {
            var omniErrorBox = document.getElementsByClassName("message-box runtime_service_omnichannelMessage runtime_service_omnichannelOmniWidget")[0];
            var omniErrorMessage = omniErrorBox.getElementsByClassName("slds-col slds-align-middle")[0].innerHTML;
        } catch {
            omniErrorMessage = "none";
        }
        if (omniErrorMessage == "none" || omniErrorMessage.includes("no active requests")) {
            console.log("Salesforce Status Helper was able to reconnect to Omni-Channel. Issue was resolved");
        }
        else {
            browser.runtime.sendMessage({
                command: "omniErrorState"
            });
            console.log("Salesforce Status Helper could not connect to Omni-Channel. Refresh the page to try and correct this error. If this issue persists please gather console logs.");
            SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: could not connect to Omni-Channel. Refresh the page to try and correct this error.';
            alert("Salesforce Status Helper could not connect to Omni-Channel. Refresh the page to try and correct this error.");
        }
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "Backlog") {
            clearInterval(availableInterval);
            availableInterval = null;
            clearInterval(backlogInterval);
            backlogInterval = null;
            clearInterval(refreshInterval);
            refreshInterval = null;
            clearInterval(autoQueueInterval);
            autoQueueInterval = null;
            clearInterval(errorCheckInterval);
            errorCheckInterval = null;
            changeToBacklog();
            backlogInterval = setInterval(changeToBacklog, 15000);
            refreshInterval = setInterval(caseCheck, 60000);
            errorCheckInterval = setInterval(errorCheck, 60000);
            SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: Enabled';
            console.log("You have set your Omni-Channel status to Backlog");
        }
        else if (message.command === "Available") {
            clearInterval(backlogInterval);
            backlogInterval = null;
            clearInterval(availableInterval);
            availableInterval = null;
            clearInterval(refreshInterval);
            refreshInterval = null;
            clearInterval(autoQueueInterval);
            autoQueueInterval = null;
            clearInterval(errorCheckInterval);
            errorCheckInterval = null;
            changeToAvailable();
            availableInterval = setInterval(changeToAvailable, 15000);
            refreshInterval = setInterval(caseCheck, 60000);
            errorCheckInterval = setInterval(errorCheck, 60000);
            SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: Enabled';
            console.log("You have set your Omni-Channel status to Available");
        }
        else if (message.command === "Disable") {
            disableHelper();
        }
        else if (message.command === "enableAutoQueue") {
            clearInterval(backlogInterval);
            backlogInterval = null;
            clearInterval(availableInterval);
            availableInterval = null;
            clearInterval(errorCheckInterval);
            errorCheckInterval = null;
            autoQueueCheck();
            errorCheckInterval = setInterval(errorCheck, 60000);
            SFSHStatusDiv.innerHTML = 'Salesforce Status Helper: Enabled with Automated Queue';
            if (autoQueueInterval == null || autoQueueInterval == 'undefined') {
                autoQueueInterval = setInterval(autoQueueCheck, 15000);
                browser.runtime.sendMessage({
                    command: "autoQueueEnabled"
                });
                browser.runtime.sendMessage({
                    command: "changeIconEnable"
                });
            }
            if (refreshInterval == null || refreshInterval == 'undefined') {
                refreshInterval = setInterval(caseCheck, 60000);
            }
        }
        else if (message.command === "disableAutoQueue") {
            disableAutoQueue();
            browser.runtime.sendMessage({
                command: "changeIconDefault"
            });
        }
    });

    if (autoQueueInterval == null || autoQueueInterval == "undefined") {
        browser.runtime.sendMessage({
            command: "changeIconDefault"
        });
    }

})();