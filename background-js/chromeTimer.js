const tabTimeObjectKey = "tabTimesObject" //{key: url, value: {url :string , trackedSeconds:number, lastDateVal:number}}
const lastActiveTabKey = "lastActiveTab" //{url: string, lastDateVal:number}


chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
        processTabChange(false);
    }
    else {
        processTabChange(true);
    }

});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    onTabTrack(tab);

})

chrome.tabs.onActivated.addListener(onTabTrack);

function onTabTrack(activeInfo) {
    let tabId = activeInfo.tabId;
    let windowId = activeInfo.windowId;

    processTabChange(true);
}

function processTabChange(isWindowActive) {
    console.log("isWindowActive: " + isWindowActive);



    setTimeout(() => {
        chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
            console.log(tabs);
            let hostName = ""
            if (tabs.length > 0 && tabs[0] != null) {
                let currentTab = tabs[0];
                let url = currentTab.url;
                hostName = url;
                let title = currentTab.title;

                try {
                    let urlOject = new URL(url);
                    hostName = urlOject.hostname;
                }
                catch (err) {
                    console.log(`urlOject error :${err}`);
                }
            }

            chrome.storage.local.get([tabTimeObjectKey, lastActiveTabKey], function (results) {

                let tabTimeObjectString = results[tabTimeObjectKey];
                let lastActiveTabString = results[lastActiveTabKey];
                console.log("background.js, get result");
                console.log(results);

                tabTimeObject = {};
                lastActiveTab = {};

                if (tabTimeObjectString != null) {
                    tabTimeObject = JSON.parse(tabTimeObjectString);
                }
                if (lastActiveTabString != null) {
                    lastActiveTab = JSON.parse(lastActiveTabString);
                }

                if (lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDateVal")) {
                    let lastUrl = lastActiveTab["url"];
                    let currentDateVal = Date.now();
                    let passedSeconds = (currentDateVal - lastActiveTab["lastDateVal"]) * 0.001;

                    if (tabTimeObject.hasOwnProperty(lastUrl)) {
                        let lastUrlObjectInfo = tabTimeObject[lastUrl];
                        if (lastUrlObjectInfo.hasOwnProperty("trackedSeconds")) {
                            lastUrlObjectInfo["trackedSeconds"] = lastUrlObjectInfo["trackedSeconds"] + passedSeconds;
                        }
                        else {
                            lastUrlObjectInfo["trackedSeconds"] = passesSeconds;
                        }
                        console.log("lastUrlObjectInfo: ");
                        console.log(lastUrlObjectInfo);
                    }
                    else {
                        let newUrlInfo = { url: lastUrl, trackedSeconds: passedSeconds, lastDateVal: currentDateVal, startDateVal: lastActiveTab["lastDateVal"] };
                        tabTimeObject[lastUrl] = newUrlInfo;
                        console.log("newUrlInfo: ");
                        console.log(newUrlInfo);
                    }
                }


                let currentDateVal = Date.now();

                let lastTabInfo = { "url": hostName, "lastDateVal": currentDateVal };

                if (!isWindowActive) {
                    console.log("window is not active right now");
                    lastTabInfo = {};
                }

                let newLastTabOject = {};
                newLastTabOject[lastActiveTabKey] = JSON.stringify(lastTabInfo);

                chrome.storage.local.set(newLastTabOject, function () {
                    console.log("lastActiveTab stored: " + hostName);
                    console.log(newLastTabOject);
                    const tabTimesObjectString = JSON.stringify(tabTimeObject);
                    let newTabTimesOject = {};
                    newTabTimesOject[tabTimeObjectKey] = tabTimesObjectString;
                    chrome.storage.local.set(newTabTimesOject, function () {

                        console.log("newTavTimesObject: ");
                        console.log(newTabTimesOject);
                    });

                });
            });


        });
    }, 500);
}