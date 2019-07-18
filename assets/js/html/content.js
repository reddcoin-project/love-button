"use strict";

const SocialNetworks = {
    Facebook: {
        networkName: 'facebook',
        domain: "facebook.com"
    },
    Reddit: {
        networkName: 'reddit',
        domain: "reddit.com"
    },
    Twitter: {
        networkName: 'twitter',
        domain: "twitter.com"
    },
    YouTube: {
        networkName: 'youtube',
        domain: "youtube.com"
    },
};

const Users = [];
let modalInjected = false;
//check location
const url = window.location;
console.log('Get Social Network = ' + url.hostname + '\n');
const socialNetwork = getSocialNetwork(url.hostname);

if (document.readyState === "complete") {
    bootstrap();
}
else {
    window.addEventListener('load', () => bootstrap(), false);
}

function bootstrap() {
    if (socialNetwork === SocialNetworks.Facebook) {
        console.log('Social Network = ' + socialNetwork);
        injectFacebook();
    }
    else if (socialNetwork === SocialNetworks.Reddit) {
        console.log('Social Network = ' + socialNetwork);
        injectReddit();
    }
    else if (socialNetwork === SocialNetworks.Twitter) {
        console.log('Social Network = ' + socialNetwork);
        injectTwitter();
    }
    else if (socialNetwork === SocialNetworks.YouTube) {
        console.log('Social Network = ' + socialNetwork);
        injectYouTube();
    }
}

function injectModalIfNeeded() {
    if (!modalInjected) {
        console.log('injecting the reddid modal');

        // load the modal popup
        document.body.insertAdjacentHTML('beforeend', modal_new);

        attachListener();

        const modal = document.getElementById('reddid_modal');
        registerEventListeners(modal);

        modalInjected = true;
    }
}


function getSocialNetwork(hostname) {
    for (const network in SocialNetworks) {
        if (SocialNetworks[network].domain === hostname) {
            console.log('Is getSocialNetwork = ' + network + '. ' + hostname + '\n');
            return SocialNetworks[network];
        }
    }

    console.log('Is not getSocialNetwork = ' + hostname + '\n');

    const dotSeparatorIndex = hostname.indexOf('.');

    if (dotSeparatorIndex > -1) {
        return getSocialNetwork(hostname.slice(dotSeparatorIndex + 1));
    }

    return '';
}

// Do Not Add Tab Or Spaces To Text Within Template Literal 'commentTemplateNewUser' It Is Carried Over To Input Field
const commentTemplateNewUser = `Thank you for your insightful comment, %USERNAME%. I'm sending you %AMOUNT% Reddcoins to show my appreciation.
You can send and receive RDD easily using the ReddID extension to tip across social platforms and reward others the same way.
Good content deserves reward and with Reddcoin you can send a microdonation directly. ${String.fromCharCode(13)}
Join the Reddcoin movement and become a ReddHead today! ${String.fromCharCode(13)}
What is Reddcoin: www.reddcoin.com ${String.fromCharCode(13)}
What is ReddID: www.reddcoin.com/redd-id ${String.fromCharCode(13)}
How to install Reddcoin tipping extension: www.reddcoin.com/redd-id ${String.fromCharCode(13)}
Live Reddcoin chat & help: https://t.me/ReddcoinOfficial`;

const commentTemplateExistingUser = 'Thank you for your insightful comment, %USERNAME%. I\'m sending you %AMOUNT% Reddcoins to show my appreciation.';

function updateComment() {
    let commentTemplate;

    if (document.getElementById("reddid_tip_input_address_id").value) {
        commentTemplate = commentTemplateExistingUser
    }
    else {
        commentTemplate = commentTemplateNewUser;
    }

    const modal = document.getElementById('reddid_modal');
    const tipId = modal.dataset.tipid;
    const tipAmount = determineTippingAmount();
    const {authorName = ''} = Users[tipId];

    const comment = commentTemplate.replace('%USERNAME%', authorName).replace('%AMOUNT%', tipAmount);

    document.getElementById("reddid_tip_input_comment_id").value = comment;
}

function registerTipClick(containerNode) {
    injectModalIfNeeded();

    containerNode.querySelector('.reddid_tip_injected_button.tip-link').addEventListener('click', function (e) {
        e.stopPropagation();
        const tipLink = e.target;
        const tipId = tipLink.dataset.tipid;
        const {url, title, authorName, authorId} = Users[tipId];

        console.log(tipId + ". " + JSON.stringify(Users[tipId]) + " selected, comment " + url);

        exports.messenger.networks('cp', socialNetwork.networkName, authorId);

        // set the address and comment fields blank while we retrieve the next user
        document.getElementById("reddid_tip_input_address_id").value = '';
        document.getElementById("reddid_tip_input_comment_id").value = '';

        // show the actual modal
        const modal = document.getElementById('reddid_modal');
        modal.dataset.tipid = tipId;
        document.getElementById('tipconfirmation_id').style.display = 'none';
        modal.style.display = 'block';

        document.getElementById('reddid_tip_username_id').innerText = authorName;
    });
}

function registerEventListeners(modal) {
    // When the user clicks on (X), close the modal
    document.getElementById('reddid_tip_button_close_id').addEventListener('click', () => hideModal(modal));
    document.getElementById('reddid_tip_button_sendtip_id').addEventListener('click', () => askTipConfirmation());
    document.getElementById('sendtip_yes').addEventListener('click', () => performTipping(modal));
    document.getElementById('sendtip_no').addEventListener('click', () => cancelTipping());

    // ICJR Comment
    //document.getElementById('qrplaceholderOver').addEventListener("click", () => toggleSize())

    // When the user changes the amount, update the comment field
    document.getElementById('reddid_tip_input_amount_id').addEventListener('keyup', (e) => {
        updateComment();
        let address = document.getElementById('reddid_tip_input_address_id').value;
        let amount = document.getElementById('reddid_tip_input_amount_id').value;
        updateQr(address, amount);
        e.stopPropagation()
    }, true);

    document.getElementById('reddid_tip_select_amount_id').addEventListener('change', (e) => {
        updateComment();
        let address = document.getElementById('reddid_tip_input_address_id').value;
        let amount = document.getElementById('reddid_tip_select_amount_id').value;
        updateQr(address, amount);
        e.stopPropagation()
    }, true);

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', () => {
        if (modal.style.display === 'flex') {
            hideModal(modal);
        }
    });

    modal.addEventListener('click', (e) => e.stopPropagation());
    modal.addEventListener('scroll', (e) => e.stopPropagation());
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function determineTippingAmount() {
    let tipAmount;
    const tipAmountInput = document.getElementById('reddid_tip_input_amount_id').value;

    if (tipAmountInput && !isNaN(tipAmountInput)) {
        tipAmount = parseInt(tipAmountInput, 10);
    }
    else {
        tipAmount = parseInt(document.getElementById('reddid_tip_select_amount_id').value, 10);
    }

    return tipAmount;
}

function askTipConfirmation() {
    document.getElementById('tipconfirmation_id').style.display = 'inline-block';
}

function cancelTipping() {
    document.getElementById('tipconfirmation_id').style.display = 'none';
}

function performTipping(modal) {
    const tipId = modal.dataset.tipid;
    const {url, title, authorName, authorId} = Users[tipId];

    // When the user clicks 'send' send the transaction
    const tipAmountInSatoshi = determineTippingAmount() * (10 ** 8);
    const address = modal.querySelector("#reddid_tip_input_address_id").value;

    // send the link to background
    exports.messenger.sendtip(socialNetwork.networkName, title, url, tipAmountInSatoshi, address, authorName);

    hideModal(modal);
}

function attachListener() {
    // Event message handling
    browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        console.log("CP Message Received " + JSON.stringify(message));

        switch (message.type) {
            case 'network':
                console.log(message);
                processNetwork(message.cp_response);
                updateComment();
                console.log("User Change " + JSON.stringify(message));
                break;
            case 'network_error':
                console.log(message);
                processNetworkError(message.cp_response);
                console.log("Network error " + JSON.stringify(message));
                break;
        }
    });

    function processNetwork(data) {
        const addressInput = document.getElementById("reddid_tip_input_address_id");
        const {address, valid = false} = data;

        if (valid) {
            addressInput.disabled = true;
            addressInput.value = address;

            document.getElementById('reddid_tip_error_id').innerText = '';
            document.getElementById('reddid_tip_button_sendtip_id').disabled = false;
        }
        else if (address) {
            addressInput.value = address;

            document.getElementById('reddid_tip_error_id').innerText = 'User not validated, but they have an address';
            //document.getElementById('reddid_tip_button_sendtip_id').disabled = true;
        }
        else {
            addressInput.value = '';

            document.getElementById('reddid_tip_error_id').innerText = 'Unable to send tip, probably the user is not registered on this social network';
            document.getElementById('reddid_tip_button_sendtip_id').disabled = true;
        }

        if (address) {
            let amount = document.getElementById('reddid_tip_select_amount_id').value;
            updateQr(address, amount);
        }
    }

    function processNetworkError(data) {
        document.getElementById('reddid_tip_error_id').innerText = data;
        document.getElementById('reddid_tip_button_sendtip_id').disabled = true;
    }
}

//------------- TODO extract to class
let timeoutId = -1;

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function checkElementsInViewport(elementMatcher, callback) {
    const allMatchingElements = elementMatcher();
    console.log(`${allMatchingElements.length} elements found in doc`);

    const visibleElements = allMatchingElements.filter(comment => isElementInViewport(comment));
    console.log(`${visibleElements.length} relevant elements  found in doc`);

    timeoutId = -1; //reset timer, so it won't trigger automatically again, only on an explicit scroll

    callback(visibleElements);
}

function handler(elementMatcher, callback) {
    console.log('about to check....')
    if (timeoutId > -1) {
        clearInterval(timeoutId);
    }
    timeoutId = setTimeout(() => checkElementsInViewport(elementMatcher, callback), 2000);
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const throttle = debounce(function (elementMatcher, callback) {
    handler(elementMatcher, callback);
}, 250);


function watchNewElementsWithClassName(className, callback) {
    console.log(`adding... ${className} - ${callback}`);

    window.addEventListener('scroll', () => {
        throttle(() => Array.from(document.getElementsByClassName(className)), callback)
    }, true);
}

function watchNewElementsWithTagName(tagName, callback) {
    console.log(`adding... ${tagName} - ${callback}`);

    window.addEventListener('scroll', () => {
        throttle(() => Array.from(document.getElementsByTagName(tagName)), callback)
    }, true);
}

let qrSmall = true;

function updateQr (address, amount) {
    var container = document.getElementById('qrimage');
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    var data = `reddcoin:${address}?amount=${amount}`;

    qr.addData(data);
    qr.make();
    qr.createImgTag();

    container.innerHTML = qr.createImgTag();

    var code = container.firstElementChild;

    code.height = 84;
    code.width = 84;
}
