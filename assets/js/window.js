if (chrome) {
    chrome.browserAction.onClicked.addListener(tab => {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            focused: true,
            height: 500,
            width: 420
        });
    });
}
else {
    browser.browserAction.onClicked.addListener(tab => {
        browser.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            focused: true,
            height: 500,
            width: 420
        });
    });

}
