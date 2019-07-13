exports.wallet = (function () {
    var priv = {
            walletStorageKey : 'reddcoinWallet',
            wallet  : false,
            monitor : false
        },
        pub = {},
        listener = {},
        electrum = require('electrum'),
        bitcore = require('bitcore'),
        reddcore = require('reddcore-lib');

    listener.idle = function(data){
        priv.saveWallet();
    };

    listener.dataReceived = function(data){
        if(data.request && data.request.method === 'blockchain.address.subscribe'){
            return;
        }
        else if(data.request && data.request.method === 'blockchain.transaction.broadcast'){
            console.log("data.request.reddTx: " + data.request.reddTx);
            switch (data.request.reddTx) {
                case 'preorder':
                    console.log("Status Preordering tx: " + data.response.result);
                    Reddcoin.reddId.setreddIdTx(data)
                    break;
                case 'register':
                    console.log("Status Registering tx: " + data.response.result);
                    Reddcoin.reddId.setreddIdTx(data)
                    break;
                case 'update':
                    console.log("Status Updating tx: " + data.response.result);
                    Reddcoin.reddId.setreddIdTx(data)
                    break;
            }
        }

        priv.updateInterface();
    };

    listener.transactionFailed = function(data) {
        debug.log(`Transaction Send Failed: ${JSON.stringify(data)}`);
        browser.notifications.create('txFailed', {
            type : "basic",
            title : "Transaction Send Failed",
            message : data.message,
            iconUrl : "assets/icon-ID-48.png"
        });
    };

    priv.updateInterface = function(){
        var popupWindow = browser.extension.getViews()[1];
        if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.popup){
            popupWindow.Reddcoin.popup.updateInterface({
                interfaceData: pub.getInterfaceData(),
                transactions: pub.getTransactions()
            });
        }
    };

    priv.startWallet = function () {
        priv.monitor = electrum.NetworkMonitor.start(priv.wallet);

        priv.monitor.addListener('idle', listener.idle);
        priv.monitor.addListener('dataReceived', listener.dataReceived);
        priv.monitor.addListener('transactionFailed', function(data){
            debug.log(`Transaction Send Failed: ${JSON.stringify(data)}`)
            browser.notifications.create({
                type : "basic",
                title : "Transaction Send Failed",
                message : "",
                iconUrl : "assets/icon-ID-48.png"
            });
        });
    };

    priv.saveWallet = function () {
        debug.log("Saving Wallet: ");
        debug.info(priv.wallet.toObject());
        localStorage.setItem(priv.walletStorageKey, JSON.stringify(priv.wallet.toObject()))
    };

    priv.loadWallet = function (walletObject) {
        debug.log("Loading Wallet: ");
        debug.info(JSON.parse(walletObject));
        priv.wallet.fromObject(JSON.parse(walletObject));
        priv.startWallet();
    };

    priv.create = function () {
        var walletObject = localStorage.getItem(priv.walletStorageKey);
        priv.wallet = electrum.WalletFactory.standardWallet();

        if(walletObject !== null){
            priv.loadWallet(walletObject);
        }
    };

    priv.addrFromScript = function (input) {

        // extract address from input script
        var script = reddcore.Script(input.script)
        var address = reddcore.Address(script).toString()

        return address;
    };

    priv.formatInputs = function (input) {

        // Format Input
        input["txId"] = input["transaction_hash"]
        delete input["transaction_hash"]
        input["satoshis"] = input["value"]
        delete input["value"]
        input["outputIndex"] = input["output_index"]
        delete input["output_index"]
        input["script"] = input["script_hex"]
        delete input["script_hex"]
        delete input["confirmations"]

        var inTx = new reddcore.Transaction.UnspentOutput(input);

        return inTx;
    };

    priv.formatOutputs = function (output) {

        // Format Output
        output["satoshis"] = output["value"]
        delete output["value"]
        output["script"] = output["script_hex"]
        delete output["script_hex"]

        var outTx = new reddcore.Transaction.Output(output)

        return outTx;
    };

    priv.createTx = function (inputs, outputs) {
        console.log ("CreateTX")
        tx = new reddcore.Transaction()

        //Add each input
        inputs.forEach(function(input){
            tx.from(priv.formatInputs(input))
        });
        //Add each output
        outputs.forEach(function(output){
            tx.addOutput(priv.formatOutputs(output))
        });

        return tx;
    };

    pub.updateName = function(address, name){
        var res = priv.wallet.updateName(address, name);
        priv.saveWallet();
        //priv.updateInterface();
        return res;
    };

    pub.updateContact = function(address, name){
        var res = priv.wallet.updateContact(address, name);
        priv.saveWallet();
        //priv.updateInterface();
        return res;
    };

    pub.getContacts = function(){
        var data = {
                contacts  : priv.wallet.getContacts()
            }; 
        return data
    }

    pub.getNewSeed = function () {
        return priv.wallet.getNewSeed();
    };

    pub.checkSeed= function (seed) {
        return priv.wallet.checkSeed(seed);
    };

    pub.checkTransaction = function (amount, tipJarEnabled) {
        return priv.wallet.checkTransaction(amount, tipJarEnabled);
    };

    pub.seed = function (seed, password, savingsAccountType) {
        seed = $.trim(seed);

        priv.wallet.buildFromMnemonic(seed, password);
        priv.wallet.activateAccount(0, 'Social Funds', 'encrypted', password);
        console.log("Savings Account Type: " + savingsAccountType);
        if(savingsAccountType !== false){
            priv.wallet.activateAccount(1, 'Savings', savingsAccountType, password);
        }

        //priv.wallet.activateAccount(2, 'Cash', 'encrypted', password);

        priv.startWallet();

        priv.saveWallet();

        return {error : false};
    };

    pub.checkPassword = function (password) {
        console.log("Wall: Calling Method: ");
        return priv.wallet.passwordIsCorrect(password);
    };

    pub.send = function (amount, account, requirePw, toAddress, password) {
        console.log("wallet sendtransaction")
        return priv.wallet.send(amount, account, requirePw, toAddress, password, priv.monitor);
    };

    pub.sendreddID = function (inputs, outputs, requirePw, password, reddidTx, highfees) {
        console.log("wallet sendReddIdTransaction")
        tx = priv.createTx(inputs,outputs)

        // get addresses used in the transaction
        var addresses = []
        inputs.forEach(function(input) {
            addresses.push(priv.addrFromScript(input))
        });

        // get keys from addresses for signing
        let account = 0;

        keys = priv.wallet.getSigningKeys(addresses, account , requirePw, password);

        // sign tx
        tx.sign(keys);


        priv.wallet.sendreddID(tx.toString(), account, priv.monitor, reddidTx, highfees);
    };

    pub.unlockTipJar = function (password) {
        priv.wallet.unlockTipJar(password);
    };

    pub.lockTipJar = function () {
        priv.wallet.lockTipJar();
    };

    pub.getTransactions = function () {
        return priv.wallet.getTransactions();
    };
    pub.getTransactionHeights = function () {
        return priv.wallet.getTransactionHeights();
    };
    pub.getPrivkey = function (address, password) {
        return priv.wallet.getPrivKey(address, password)
    };
    pub.decodeRawTransaction = function (rawTx) {
        return priv.wallet.decodeRawTransaction (rawTx)
    };

    pub.getInterfaceData = function () {
        var format = bitcore.util.formatValue,
            addresses = priv.wallet.getAddresses('all'),
            accounts  = priv.wallet.getAccountInfo(),
            contacts = priv.wallet.getContacts(),
            confirmed = 0,
            unconfirmed = 0,
            total = 0,
            data = {
                accounts  : accounts,
                addresses : addresses,
                contacts  : contacts
            };

        accounts.forEach(function(account){
            confirmed += account.confirmed;
            unconfirmed += account.unconfirmed;
        });

        total = confirmed + unconfirmed;

        data.totalBalance = total;
        data.confirmedBalance = confirmed;
        data.unconfirmedBalance = unconfirmed;

        return data;
    };
    debug.log("New wallet create")
    priv.create();

    return pub;
})();