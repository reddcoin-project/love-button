if (chrome) {
    chrome.browserAction.onClicked.addListener(tab => {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            focused: true,
            height: 640,
            width: 480
        });
    });
}
else {
    browser.browserAction.onClicked.addListener(tab => {
        browser.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            focused: true,
            height: 640,
            width: 480
        });
    });
}
