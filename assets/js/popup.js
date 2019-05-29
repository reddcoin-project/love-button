if(chrome) {
    let elements = document.getElementsByTagName('a');

    for (let i = 0, n = elements.length; i < n; i++) {
        elements[i].addEventListener('click', (e) => {
            chrome.tabs.create({ url: e.target.href });
        });
    }
}
else {
    let elements = document.getElementsByTagName('a');

    for (let i = 0, n = elements.length; i < n; i++) {
        elements[i].addEventListener('click', function(e) {
            browser.tabs.create({ url: e.target.href });
        });
    }
}
