/*************************************************
* Popup UI
* Setup initial state and extension action & settings
*************************************************/

(function (){
    var priv = {
            walletData           : false,
            isFullPageMode       : false,
            isIframe             : false,
            transactionsRendered : false,
            settings: {},
            namespace: '.tester'
        },
        pub = {};

    /*Private*/
    priv.openTab = function (tabName) {

        // Get all elements with class="tabcontent" and hide them
        $(".tabcontent").hide();

        // Get all elements with class="tablinks" and remove the class "active"
        $(".tablinks").removeClass('active');

        let destTarget = tabName.substr(3);

        if(destTarget !== 'password'){
            localStorage["rddLastWalletTab"] = tabName;
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        $("#" + destTarget).show();
        $("#" + tabName).addClass('active');
    };

    priv.withPassword = function(callback, message){
        let checkPassword = function(){
            let val = $('#password').val(),
                requirePw = true;

            if($("#sendAccount option:selected").attr("data-with-pass") !== 'yes'){
                requirePw = false;
            }

            $("#passwordError").hide();
            $("#password").hide();
            $("#pwLoading").show();

            setTimeout(function(){
                //we're doing this with a timeout as the password check does a bunch of hashes which
                //may cause some browser lockup
                debug.log(`send checkPassword`);

                exports.messenger.checkPassword(val, function(isValid){
                    let $pw = $("#password");
                    $pw.val("");

                    if(isValid || ! requirePw){
                        setTimeout(function(){
                            debug.log(`send transaction`)
                            callback(val, requirePw);
                            $pw.show();
                            $("#pwLoading").hide();
                        }, 1000);

                        return;
                    }

                    $("#passwordError").slideDown("slow");
                    $("#pwLoading").hide();
                    $pw.show();
                    $pw.focus();
                });
            }, 100);
        };

        if(message){
            $("#passwordMessage").html(message).show();
        }

        var cancel = function(){
            priv.openTab("tabSend");
        };

        $("#passwordError").hide();

        priv.openTab('tabPassword');

        $("#passwordCancel").click(cancel);
        $("#passwordOkay").click(checkPassword);

        $("#password").focus();
    };

    priv.closePopup = function () {
        //TODO
        /*if (priv.isIframe) {
        exports.messenger.closePaymentPopup();
        }*/

        window.close();
    };

    priv.notification = function (title, message, seconds, speed) {
        browser.notifications.create('transactioninProgress', {
            type : "basic",
            title : `${title}`,
            message : `${message}`,
            iconUrl : "/assets/icon-ID-48.png"
        });
    };

    priv.updateSendForm = function(address, label, amount){
        $("#walletSend_address").val(address || '');
        $("#walletSend_amount").val(amount || '');
    };

    priv.sendGui = function (details) {
        var $address = $("#walletSend_address"),
            $amount = $("#walletSend_amount"),
            name =  $.trim(details.contact),
            toAddress = $.trim(details.address),
            amount = $.trim(details.amount),
            addressIsValid = /^[Rr][a-zA-Z0-9]{26,34}$/.test(toAddress),
            amountIsValid = !isNaN(parseFloat(amount)),
            sendFunction;

            $address.removeClass("error");

        if (!addressIsValid) {
            $address.addClass("error");
        }

        $amount.removeClass("error");

        if (!amountIsValid) {
            $amount.addClass("error");
        }

        exports.messenger.updateContact(toAddress, name);

        if (!amountIsValid || !addressIsValid) {
            return;
        }

        sendFunction = function(password, requirePw){
            var account = $("#sendAccount").val();

            debug.log(`sendFunction sendTransaction`);

            exports.messenger.sendTransaction(amount, account, requirePw, toAddress, password, function () {
                priv.updateSendForm();

                if(account === '-1' && requirePw){
                    exports.messenger.unlockTipJar(password, function(){
                        dbg('Tip Jar Unlocked!');
                    });
                }

                priv.notification("Transaction is being broadcast.", `Sending ${amount} RDD`);

                priv.openTab("tabSend");

                var closePopup = function () { priv.closePopup(); };

                if (priv.isFullPageMode) {
                    setTimeout(closePopup, 4000);
                }
            });
        };

        var msg = "You are about to send <strong>"+details.amount+" RDD</strong> to <strong>"+details.address+"</strong>";
        msg += '<br/>';
        msg += '<br/>';
        msg += 'This will debit the following account: ';
        msg += '<select name="sendAccount" id="sendAccount">';

        $.each(details.usableAccounts, function(i, account){
            var requirePw = 'yes';

            if(!account.requiresPassword){
                requirePw = 'no';
            }

            msg += '<option data-with-pass="'+requirePw+'" value="'+account.index+'">'+account.name+'</option>';
        });

        msg +=  '</select>';

        $("#pwLoading").hide();

        priv.withPassword(sendFunction, msg);

        $("#sendAccount").change(function(){
            var $pwContainer = $('#sendPwContainer'),
                requiresPw = $('option:selected', $(this)).attr('data-with-pass');

            if(requiresPw === 'yes'){
                $pwContainer.show();
            }
            else {
                $pwContainer.hide();
            }

            amount = amount * 1;

            var hideThreshold = priv.settings.hidePromptThreshold * 1;

            debug.log(amount, hideThreshold, requiresPw);
            debug.log(amount <= hideThreshold , requiresPw !== 'yes');

            if(amount <= hideThreshold && requiresPw !== 'yes'){
                console.log('triggering');
                $("#passwordOkay").trigger('click');
                priv.openTab('tabAutoSent');//TODO

                setTimeout(function(){
                    priv.openTab("tabSend");
                }, 3000);
            }
        });

        $("#sendAccount").trigger('change');
    };

    priv.checkTipJar = function(data, balance){
        console.log('Checked Tipjar');
    };

    priv.renderRegister = function (data) {
        console.log('Render Register');

        var render = function(data) {
            exports.viewWalletRegister.getView(data);
        };

        // set data equal to false if not provided
        data = data || false;

        // if data provided, render them and exit
        if (data !== false && data !== undefined) {
            render(data);
            return;
        }

        //data not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            render(data);
        });
    };

    priv.renderRegistered = function (userid) {
        console.log('Render Registered');

        var render = function(data) {
            exports.viewWalletRegister.getView(data);
        };

        //data not provided. Fetch then render.
        exports.messenger.getUserIdData(userid.user, function (data) {
            render(data);
        });
    };

    priv.renderAccounts = function(data){
        console.log('Render Accounts');

        var render = function(data) {
            var html = exports.viewWalletAccounts.getView(data),
                node = document.getElementById('WalletBalances');

            if (node) {
                node.innerHTML = html;
            }
        };

        // set data equal to false if not provided
        data = data || false;

        // if data provided, render them and exit
        if (data !== false && data !== undefined) {
            render(data);
            return;
        }

        //transactions not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            render(data);
        });
    };

    priv.renderSend = function(data){
        console.log('Render Send');

        var render = function(data) {
            exports.viewWalletSend.getView(data);
        };

        // set data equal to false if not provided
        data = data || false;

        // if data provided, render them and exit
        if (data !== false && data !== undefined) {
            render(data);
            return;
        }

        //contact not provided. Fetch then render.
        exports.messenger.getContacts(function (data) {
            render(data);

            //capture reddids also from cache
            exports.messenger.getReddidContacts(priv.namespace,function(data){
                render(data);
            });
        });

        exports.messenger.getWalletData(function (data) {
            let accounts = data.accounts,
                options = '',
                select = $('#sendFromAccount');

            accounts.forEach(account => {
                options += `<option value="${account.index}">${account.name}</option>`;
            });

            select.append(options);
            select.trigger('change');
        });
    };

    priv.renderAddresses = function(data){
        console.log('Render Addresses');
    };

    priv.renderContacts = function(data){
        console.log('Render Accounts');
    };

    priv.renderTransactions = function(data){
        console.log('Render Transactions');
    };

    priv.renderHistory = function(data){
        console.log('Render History');

        var render = function(data) {
            var html = exports.viewWalletHistory.getView(data),
                node = document.getElementById('WalletHistoryTable');

            if (node) {
                node.innerHTML = html;
            }
        };

        // set data equal to false if not provided
        data = data || false;

        // if data provided, render them and exit
        if (data !== false && data !== undefined) {
            render(data);
            return;
        }

        //transactions not provided. Fetch then render.
        exports.messenger.getWalletTransactions(function (data) {
            render(data);
        });
    };

    priv.renderReceived = function(data, account){
        console.log('Render Received');

        var render = function(data) {
            var html = exports.viewWalletReceive.getView(data, account),
                node = document.getElementById('WalletReceiveTable');

            if (node) {
                node.innerHTML = html;
            }
        };

        // set data equal to false if not provided
        data = data || false;
        account = account || 0;

        // if data provided, render them and exit
        if (data !== false && data !== undefined) {
            render(data, account);
            return;
        }

        //transactions not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            render(data, account);
        });
    };

    priv.renderWalletData = function (data, transactions) {
        console.log("Update from background - render wallet data.");

        var tipJarBalance = data.addresses[0].confirmed;

        if(balance == 0){
            priv.setState("Deposit");
            $('#initialDepositAddress').text(data.addresses[1].address);
            $('#copyDepositAddress').attr('data-address', data.addresses[1].address);

            $('#copyDepositAddress').click(function(){
                priv.copyAddress($(this));
            });
        }

        priv.checkTipJar(data.totalBalance, tipJarBalance);
        priv.renderAccounts(data);
        priv.renderAddresses('#myAddressList');
        priv.renderContacts('#myContacts');
        priv.renderHistory(transactions);
        priv.renderRegister(data);
    };

    /*Public*/
    pub.setCost = function(data) {
        console.log("setCost on: " + JSON.stringify(data))
    };

    pub.sendGui = function (details) {
        priv.sendGui(details);
    };

    pub.updateInterface = function (data) {
        priv.renderWalletData(data.interfaceData, data.transactions);

        if (priv.transactionsRendered || true) {
            priv.renderTransactions(data.transactions);
        }
    };

    pub.updateSend = function (data) {
        //Display send page, fetch contacts
        priv.renderSend(data);
    };

    pub.updateHistory = function () {
        //transactions not provided. Fetch then render.
        exports.messenger.getWalletTransactions(function (data) {
            priv.renderHistory(data);
        });
    };

    pub.updateBalance = function () {
        //transactions not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            priv.renderAccounts(data);
        });
    };

    pub.updateAccount = function () {
        //transactions not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            priv.renderAccounts(data);
        });
    };

    pub.updateRegister = function (data) {
        //transactions not provided. Fetch then render.
        console.log("updateRegister on: " + JSON.stringify(data));
        priv.renderRegister(data);
    };

    pub.updateRegistered = function (data) {
        console.log("updateRegistered on: " + JSON.stringify(data));
        priv.renderRegistered(data);
    };

    pub.updateReceive = function (data, account) {
        //transactions not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            priv.renderReceived(data,account);
        });
    };

    pub.updateReceiveAccount = function (account) {
        //transactions not provided. Fetch then render.
        exports.messenger.getWalletData(function (data) {
            priv.renderReceived(data,account);
        });
    };

    pub.updateNameCost = function (name) {
        if (Reddcoin.viewWalletRegister.checkName(name, priv.namespace)) {
            Reddcoin.messenger.getCost(name, priv.namespace, function(data) {
                debug.log(`UpdateUI getcost: ${JSON.stringify(data)}`)
                priv.renderRegister(data);
            });
        }
    };

    pub.displayOrderStatus = function () {
        Reddcoin.messenger.getReddidStatus(function(data){
            priv.renderRegister(data);
            $('.reddidPopupPage_StatusOverlay').show();
        })
    };

    pub.cancelId = function () {
        Reddcoin.viewWalletRegister.cancelId();
    };

    pub.orderId = function () {

        // this is an async timeout util (very useful indeed)
        const timeout = async ms => new Promise(res => setTimeout(res, ms));

        let next = false; // this is to be changed on user input
        $('#passwordOkayOverlay').click(function() {
            next = true
        });

        async function waitUserInput() {
            while (next === false) await timeout(50); // pause script but avoid browser to freeze ;)
            next = false; // reset var
            console.log('user input detected');
        }

        async function orderUp () {
            let val  = document.getElementById('redd_id_value').value;
            let uid = document.getElementById('redd_id_input').value;
            val = val.substring(0, val.indexOf(' RDD'));

            $("#passwordErrorOverlay").hide();
            $("#pwLoadingOverlay").hide();

            let details = await checkTx(val,true);

            if (details.isPossible) {
                debug.log(JSON.stringify(details))
                let msg = "You are about to send <strong>"+details.amount+" RDD</strong> to order the ID <strong>"+uid+"</strong>";
                msg += '<br/>';
                msg += '<br/>';
                $("#passwordMessageOverlay").html(msg).show();
                $(".reddidPopupPage_PasswordOverlay").show();

                await waitUserInput();
                let pwd = $('#passwordOverlay').val();
                $("#pwLoadingOverlay").show();
                let checkPwd = await checkPassword(pwd);

                if (checkPwd) {
                    $("#passwordErrorOverlay").hide();
                    $("#pwLoadingOverlay").hide();
                    $(".reddidPopupPage_PasswordOverlay").hide();
                    document.getElementById('redd_id_input').disabled = true;
                    document.getElementById('redd_id_btn_order').disabled = true;
                    $('#error_msg_txt').text('');
                    $("#orderLoading").show();
                    let oi = await orderId(uid, priv.namespace, pwd);
                    debug.log(`${JSON.stringify(oi)}`);
                }
                else {
                    $("#passwordErrorOverlay").show();
                    $(".reddidPopupPage_PasswordOverlay").hide();
                    $('#passwordOverlay').val('');
                    $('#error_msg_txt').text('Wrong Password');
                }
            }
        }

        orderUp();

        function checkTx(value, tipJarEnabled) {
            return new Promise (resolve => {
                Reddcoin.messenger.checkTransaction(value, true, (data) => {
                    resolve(data);
                });
            });
        };

        function checkPassword(password) {
            return new Promise ((resolve, reject) => {
                Reddcoin.messenger.checkPassword(password, (data) => {
                    resolve(data);
                });
            });
        };

        function orderId(uid, namespace, password) {
            return new Promise ((resolve, reject) => {
                Reddcoin.messenger.order(uid, namespace, password, (data) => {
                    resolve(data);
                });
            });
        };

        function checkOrder(user, operation) {
            return new Promise ((resolve, reject) => {
                Reddcoin.messenger.checkOrder(user, operation, (data) => {
                    resolve(data);
                });
            });
        };
    };

    pub.registerId = function () {
        if (Reddcoin.viewWalletRegister.registerId() == true){
            console.log("Register started");
            document.getElementById('redd_id_btn_register').disabled = true;
            let uid = $('#redd_id_input').val();
            let password = $('#passwordOverlay').val();

            Reddcoin.messenger.registerId(uid, priv.namespace, password, function(data) {
                //TODO
                // Check progress
                /*Reddcoin.messenger.checkOrder(uid,'register', function(data) {
                debug.log(JSON.stringify(data));
                });*/
            });
        }
    };

    priv.processFormdata = function (data) {
        var profile = {};
        var saveData = {};
        var fieldname;

        // Get all elements with class="reddidPopupSocial_inputdata" and extract values
        var formData = document.getElementsByClassName("reddidPopupSocial_inputdata");

        for (var i = 0; i < formData.length; i++) {
            fieldname = formData[i].id;
            profile[fieldname] = formData[i].value;
        }

        saveData[data]=profile;

        return saveData;
    };

    pub.getNamespace = function () {
        return priv.namespace
    };

    pub.displayWalletSetup = function () {
        let url = '/setup-wallet.html';
        let win = window.open(url,'_blank');
        win.focus();
    };

    pub.init = function () {
        Reddcoin.messenger.getSettings( function (settings) {
            priv.settings = settings
        });
    };

    Reddcoin.popup = pub;
})(Reddcoin);

//Yeah. I know...
$(function () {
    Reddcoin.popup.init();
});

/**
 * Function to set the popup listeners for the GUI
 */
function setPopupGuiListeners() {
    debug.log(`Set listeners (onload)`);
    // timer for listening to user input
    let inputTimeout = null;

    document.getElementById('reddidPopup').onchange = function (e) {
        console.log("Gui Element onChange: " + e.target.id);

        var onchangeName = e.target.id;
        var onchangeValue = e.target.value;

        switch (onchangeName) {
            case 'getWalletReceiveAccountSelect':
                Reddcoin.popup.updateReceiveAccount(onchangeValue);
                break;
            case 'selectBlockchainUserIds':
                Reddcoin.popup.updateRegistered({user: onchangeValue});
                break;
            case 'walletSend_contactname':
                var options = e.target.list.options

                var address = '';
                for (key in options){
                    if (options[key].value === onchangeValue){
                        address = options[key].getAttribute('data-value')
                    }
                }

                var data = {user: onchangeValue, address: address}
                Reddcoin.popup.updateSend(data);
                break;

            default:
                console.log("Not what we needed")
        }
    };


    // UI onKeyup
    // lookup value from input
    document.getElementById('reddidPopup').onkeyup = function (e) {
        console.log(`Gui Element onKeyup ${e.target.id} | ${e.target.value}`);

        //clear timeout
        clearTimeout(inputTimeout);

        // wait for input
        inputTimeout = setTimeout(function () {
            let clickName = e.target.id;

            switch (clickName) {
                case 'redd_id_input':
                    Reddcoin.popup.updateNameCost(e.target.value);
                    break;
                case 'walletSend_contactname':
                    var data = {search: e.target.value};
                    Reddcoin.popup.updateSend(data);
                    break;
                default:
                    console.log("Not what we needed")
            }
        }, 500);
    };

    // COMMENT: ICJR
    /* Make tip links open in new tab */
    //document.getElementById('reddidPopupTipFeed_tbl').onclick = function (e) {
    //    var target = e.target.href;
    //    if (!target) {
    //        return;
    //    }

    //    browser.tabs.create({url: target});
    //    return false;
    //};


    // UI onClick events
    document.getElementById("reddidPopup").onclick = function (e) {
        var clickName = e.target.id;

        console.log("Gui Element Clicked " + clickName);

        switch (clickName) {
            case 'menuWelcome':
                displayWelcome();
                break;
            case 'registerBtn':
            case 'registerContinueFromCreationBtn':
            case 'registerContinueFromRecoveryBtn':
            case 'menuRegister':
                displayRegister();
                break;
            case 'menuReddID':
                displayReddID();
                break;
            case 'menuSocial':
                displaySocial();
                break;
            case 'menuTipFeed':
                displayTipFeed();
                break;
            case 'createWalletBtn':
            case 'createWalletSetup':
                Reddcoin.popup.displayWalletSetup();
                break;
            case 'menuWallet':
                displayWallet();
                break;
            case 'menuStatus':
                displayStatus();
                break;
            case 'walletSend_send':
                walletSend();
                break;
            // Register UI functions
            case 'redd_id_btn_cancel':
                Reddcoin.popup.cancelId();
                break;
            case 'redd_id_btn_register':
                Reddcoin.popup.registerId();
                //registerid();
                break;
            case 'redd_id_btn_order':
                Reddcoin.popup.orderId();
                break;
            case 'passwordCancelOverLay':
                $('#passwordOverlay').val('')
                $('.reddidPopupPage_PasswordOverlay').hide();
                break;
            case 'statusCloseOverlay':
                $('.reddidPopupPage_StatusOverlay').hide();
                break;
            case 'statusHistoryOpenOverlay':
                Reddcoin.popup.displayOrderStatus();
                break;
            // Wallet UI functions
            case 'genAddress':
                console.log("Generate Address");
                addr = generateAddress(network);
                break;
            case 'verify':
                console.log("Verify Username");
                break;
            default:
                console.log("Not what we needed");
        }

    };

    /* Wallet Tab control */
    $('#walletTabs').on('click', (e) => {
        const tabName = e.target.id;

        if (tabName === "walletTabs") {
            return;
        }

        // Get all elements with class="tabcontent" and hide them
        $(".tabcontent").hide();

        // Get all elements with class="tablinks" and remove the class "active"
        $(".tablinks").removeClass('active');

        var destTarget = tabName.substr(3);

        // Show the current tab, and add an "active" class to the link that opened the tab
        $("#" + destTarget).show();
        $("#" + tabName).addClass('active');
    });
}

/**
* Function to determine whether to display the register ID button on the welcome page
* @param data {{}}
* @returns {boolean}
*/
function shouldShowRegisterButton(data) {

    if (data.useridsObj.dataAvailable !== true) return true;
    if (data.useridsObj.preordered.status !== true) return true;
    if (data.useridsObj.registered.status !== true) return true;

    return false;
}

/**
* Function to display the welcome page
*/
function displayWelcome() {
    $('#createWalletSetup').hide();

    Reddcoin.messenger.getAppState(response => {
        if (!response.walletObj.dataAvailable) {
            $('#createWalletSetup').show();
        }
        else {
            $('#createWalletSetup').hide();

            Reddcoin.messenger.getUserIds(function (result) {
                debug.log(`${result.length} user ids registered`);
            });
        }
    });
}

/* Display the Register page */
function displayRegister() {
    Reddcoin.messenger.getReddidStatus(function(data){
        Reddcoin.popup.updateRegister({action: 'open'});
        Reddcoin.popup.updateRegister({registration: data});
    });
}

/* Display the ReddID page */
function displayReddID() {
    Reddcoin.messenger.createUser(true, function(){
        let useridsObject = localStorage.getItem('userids');

        if (useridsObject !== null) {
            const userids = JSON.parse(localStorage.userids);
            const user = userids[0].uid
            debug.log("Loading UID " + user);
            Reddcoin.popup.updateRegistered({user: user});
        }
        else {
            debug.log(`No users registered`);
            Reddcoin.popup.updateRegistered({user: null});
        }
    });
}

/* Display the Social page */
function displaySocial() {
    Reddcoin.viewSocialNetworks.getView();
}

/* Display the Tipping page */
function displayTipFeed() {
    /* Build recent tips table on load */
    open_tiplink_tbl();
}

/* Display the Wallet page */
function displayWallet() {
    if (localStorage.reddcoinWallet) {
        $('#walletSwapInteract').trigger('click');
    }
    else {
        $('#createWalletSetup').trigger('click');
    }

    if (localStorage.reddcoinWallet || localStorage.user) {
        Reddcoin.popup.updateBalance();
        Reddcoin.popup.updateHistory();
        Reddcoin.popup.updateSend();
        Reddcoin.popup.updateAccount();
        Reddcoin.popup.updateReceive();
    }
}

/**
* Function to display the status page of the UI
*/
function displayStatus() {
    Reddcoin.messenger.getconnectionState(function(data){
        Reddcoin.viewWalletStatus.getView(data);

        Reddcoin.messenger.getReleaseVersion( function(data) {
            Reddcoin.viewWalletStatus.getView(data);
        });
    });
}

//set the menustate (on/off)
function setPopupMenuDisplay(){
    if (localStorage.reddcoinWallet) {
        //wallet data available
        console.log("Wallet is set.. Welcome");
        document.getElementById('menuRegister').style.display = 'block';
        document.getElementById('walletActive').style.display = 'block';
        document.getElementById('menuBuySell').style.display = 'block';
    }
    else {
        console.log("No wallet data is set.. Welcome");
        document.getElementById('walletActive').style.display = 'none';
        document.getElementById('menuRegister').style.display = 'none';
        document.getElementById('menuSocial').style.display = 'none';
        document.getElementById('menuTipFeed').style.display = 'none';
        document.getElementById('menuFollowing').style.display = 'none';
        document.getElementById('menuBuySell').style.display = 'none';
    }

    Reddcoin.messenger.getUserIds(function(response){
        let userCount = response.length;

        if ( userCount > 0 && userCount <= 24 ) {
            document.getElementById('menuRegister').style.display = 'block';
            document.getElementById('menuSocial').style.display = 'block';
            document.getElementById('menuTipFeed').style.display = 'block';
            document.getElementById('menuFollowing').style.display = 'block';
        }
        else if (userCount > 25) {
            document.getElementById('menuRegister').style.display = 'none';
            document.getElementById('menuSocial').style.display = 'block';
            document.getElementById('menuTipFeed').style.display = 'block';
            document.getElementById('menuFollowing').style.display = 'block';
        }
        else {
            document.getElementById('menuReddID').style.display = 'none';
            document.getElementById('menuSocial').style.display = 'none';
            document.getElementById('menuTipFeed').style.display = 'none';
            document.getElementById('menuFollowing').style.display = 'none';
        }
    });
}

function walletSend() {
    var toAddress = document.getElementById('walletSend_address').value;
    var toContact = document.getElementById('walletSend_contact').value;
    var amount = document.getElementById('walletSend_amount').value;
    var account = document.getElementById('sendFromAccount').value;
    var requirePw = false;
    var password = '';

    // TODO tipjar enabled hardcoded? need to make this optional
    Reddcoin.messenger.checkTransaction(amount, true, function (details) {
        details.address = toAddress;
        details.contact = toContact;

        if (details.isPossible) {
            $('#send_error_msg_txt').text('');
            exports.popup.sendGui(details);
        }
        else {
            $('#send_error_msg_txt').text('The transaction is not possible. Maybe you entered the wrong address or you do not have enough funds?');
        }

    });
}
