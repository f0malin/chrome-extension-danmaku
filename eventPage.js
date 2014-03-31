if (!localStorage.state) {
    localStorage.state = "OFF";
}
chrome.browserAction.setBadgeText({text: localStorage.state});
chrome.browserAction.onClicked.addListener(function(tab) {
    if (localStorage.state == "OFF") {
        localStorage.state = "ON";
    } else {
        localStorage.state = "OFF";
    }
    chrome.tabs.query({}, function(tabs) {
        for (var i=0;i<tabs.length;i++) {
            chrome.tabs.sendMessage(tabs[i].id, {plugin_switch: localStorage.state});
        }
    });
    chrome.browserAction.setBadgeText({text: localStorage.state});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.ask_state) {
        sendResponse({plugin_switch: localStorage.state});
    }
});

