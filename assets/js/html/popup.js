// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var COIN = 0.00000001;
// var network = "testnet"

var tip_links = [];


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//process incoming tip and highlight row
function process_tiplink(data) {
    open_tiplink_tbl();

    var myTable = document.getElementById("reddidPopupTipFeed_tbl");
    var urlSelect = "a[href *='" + data.url + "']";
    var myRow = $(myTable).find(urlSelect);

    var urlRow = $(myRow).closest("tr");

    urlRow.addClass('stylish');
        setTimeout(function() {
        urlRow.removeClass('stylish');
    }, 1000);
}

// this is called when opening the Tip Feed menu
function open_tiplink_tbl() {
    // remove/clear all the rows
    var myTable = document.getElementById("reddidPopupTipFeed_tbl").getElementsByTagName('tbody')[0];
    myTable.innerHTML = '';

    process_tiplink_tbl();
}

function process_tiplink_tbl() {
    var myTable = document.getElementById("reddidPopupTipFeed_tbl").getElementsByTagName('tbody')[0];
    var tip_data = localStorage.tip_links ? JSON.parse(localStorage.tip_links) : [];

    var grouped = groupBy("url", tip_data);

    for (const x in grouped) {
        var network = grouped[x][0].network;
        var url = x;
        var title = grouped[x][0].title;
        var count = (grouped[x]).length;
        var value = 0

        for (const y in grouped[x]){
            value += grouped[x][y].value;
        }

        myTable.insertRow(0).innerHTML = '<td id="reddidPopupTipFeed_col1">' + network + '</td><td id="reddidPopupTipFeed_col2"><a href="' + url + '">' + title + '</a></td><td id="reddidPopupTipFeed_col3">' + count + '</td><td id="reddidPopupTipFeed_col4">' + (value * COIN) + '</td>'
    }
}

// function to group and count our links
function groupBy(propertyName, array) {
    var groupedElements = {};

    for(var i = 0; i < array.length; i++) {
        var element = array[i];
        var value = element[propertyName];

        var group = groupedElements[value];

        if(group == undefined) {
            group = [element];
            groupedElements[value] = group;
        }
        else {
            group.push(element);
        }
    }

    return groupedElements;
}

function process_network(data) {
    console.log(data)
    Reddcoin.viewSocialNetworks.processNetwork(data);
}

// Event message handling
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("PU Message Received " + JSON.stringify(message));

    switch (message.type) {
        case "tip_link":
            process_tiplink(message.payload);
            break;
        case "network":
            process_network(message.payload);
            break;
    }

    if (message.address) {
        console.log("OM Address: " + message.address)
    }

    if (message.greeting == "hello") {
        sendResponse({farewell: "goodbye"});
    }

    if (message.request == "checkStatus") {
        sendResponse({done: taskCompleted});
    }

    return true;
});

/**
* Function to initialize the Popup.
*/
window.onload = function() {

    // Set the app listeners for the GUI
    setPopupGuiListeners(); //TODO check if these are obsolete or need to be moved

    // Display welcome page
    displayWelcome();

    // Load the saved theme
    Reddcoin.messenger.getSettings(function (settings) {
        if (settings && settings.theme) {
            document.body.setAttribute('data-theme', settings.theme);
        }
    });

    // Constructs the name suggestion engine (typeahead)
    var usernames = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // The url points to a json file that contains an array of user names
        prefetch: {
            url: 'http://reddid01.reddcoin.com:5000/api/name/allnames/tester',
            cache: false,
            transform: function(data) {return data.results}
        }
        //prefetch: 'http://redd.ink:8080/api/name/allnames/test'
    });

    // Initializing the typeahead with remote dataset
    usernames.initialize();

    $('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'usernames',
        source: usernames,
        limit: 15 /* Specify maximum number of suggestions to be displayed */
    });

    $(document).tooltip({
        track: true
    });
};

// set a timer to poll for network updates 10secs
window.setInterval(function() {

    //block_height = browser.extension.getBackgroundPage().block_height;
    // Update the popup page with values
    //document.getElementById('block_height').innerText = block_height;
    Reddcoin.messenger.getBlockheight(function(msg) {
        console.log ("Value of height is " + JSON.stringify(msg));

        if (msg) {
            document.getElementById('block_height').innerText = msg.bitcoind_blocks;
            document.getElementById('index_height').innerText = msg.last_block;
            document.getElementById('index_state').innerText = msg.indexing;
        }
    });

    Reddcoin.messenger.getConnections(function(msg) {
        document.getElementById('online').innerText = `${msg.online_users}`;
        document.getElementById('online_max').innerText = `( Max: ${msg.max_users} )`;
    });
}, 5000);
