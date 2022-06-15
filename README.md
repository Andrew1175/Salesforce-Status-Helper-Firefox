Salesforce Status Helper created by Drew Rutherford

Available on Firefox: https://addons.mozilla.org/en-US/firefox/addon/salesforce-status-helper

-----------------------------------------------------------------------------------------------------

Description:

This extension is useful for when Omni-Channel disconnects you unexpectedly and without warning.

Features:
- Automated queue where it will change your status from Available -> Backlog -> Offline based on your time input.
- If you choose to manually set your status, click your preferred Omni-Channel status. The chosen status will remain active until disabled.
- Every 15 seconds the extension will check that you're still logged in with the selected status or if using the automated queue based on your input time. If not, it will automatically sign you back in.
- Every 60 seconds the extension will check that Omni Supervisor is in a healthy state.

NOTES:
- If the extension detects that you're 'On a Web Case' it will NOT change your status. You will have to manually change out of it first.
- This will ONLY work in .salesforce.com or .force.com domains. If you try to set your status in another tab without these domains nothing will happen.
- If you don't have Omni Supervisor open in a Salesforce tab then an error will display in the console. More importantly you can enter into an error state that the extension can't detect.

-----------------------------------------------------------------------------------------------------

Troubleshooting:

If you open Web Developer Tools by either pressing 'F12' or by going into Settings > More Tools > Developer Tools you will see various console logs. Please use these logs to report any issues.
