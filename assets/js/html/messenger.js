/*************************************************
* Messenger
* message processing between extension
*************************************************/
(function () {

    const priv = {},
        pub = {};


    priv.message = function(method, data, callback = () => {}){
        data = data || {};

        if(typeof data === 'function'){
            console.log('Not supposed to be here');
            callback = data;
            data = {};
        }

        data.method = method;

        // lets not leak the seed anywhere
        const skipList = ['checkSeed', 'seedWallet'];

        if (skipList.indexOf(data.method) < 0 ) {
            window.debug.info("Messenger Calling" + JSON.stringify(data))
        }

        browser.runtime.sendMessage(data)
            .then(callback)
            .catch(callback);
    };


    pub.getCost = function(uid, namespace, callback){
        priv.message("getCost", {
            uid:uid,
            namespace:namespace
        }, callback);
    };

    pub.order = function(uid, namespace, password, callback){
        priv.message("order", {
            uid:uid,
            namespace:namespace,
            password:password
        }, callback);
    };

    pub.orderId = function(uid, namespace, password, callback){
        priv.message("orderId", {
            uid:uid,
            namespace:namespace,
            password:password
        }, callback);
    };

    pub.registerId = function(uid, namespace, password, callback){
        priv.message("registerId", {
            uid:uid,
            namespace: namespace,
            password: password
        }, callback);
    };

    pub.checkOrder = function(user, operation, callback){
        priv.message("checkOrder", {
            uid: user,
            operation:operation
        }, callback);
    };

    pub.checkPassword = function(password, callback){
        priv.message("checkPassword", {password:password}, callback);
    };

    pub.getBlockheight = function(callback) {
        priv.message("getBlockheight", {}, callback);
    };

    pub.getConnections = function(callback) {
        priv.message("getConnections", {}, callback);
    };

    pub.getWalletTransactions = function(callback){
        priv.message("getWalletTransactions", {}, callback);
    };

    pub.getWalletData = function(callback){
        priv.message("getWalletData", {}, callback);
    };

    pub.checkTransaction = function(amount, tipJarEnabled, callback){
        priv.message("checkTransaction", {
            amount:amount,
            tipJarEnabled : tipJarEnabled
        }, callback);
    };

    pub.checkSeed = function(seed, callback){
        priv.message("checkSeed", {seed:seed}, callback);
    };

    pub.getNewSeed = function(callback){
        priv.message("getNewSeed", {}, callback);
    };

    pub.seedWallet = function(seed, password, savingsAccountType, callback){
        priv.message("seedWallet", {seed:seed, password:password, savingsAccountType: savingsAccountType}, callback);
    };

    pub.unlockTipJar = function(password, callback){
        priv.message("unlockTipJar", {password:password}, callback);
    };

    pub.lockTipJar = function(callback){
        priv.message("lockTipJar", {}, callback);
    };

    //amount, account, requirePw, toAddress, password
    pub.sendTransaction = function(amount, account, requirePw, toAddress, password, callback){
        const data = {
            amount: amount,
            account: account,
            requirePw: requirePw,
            password: password,
            to: toAddress
        };

        priv.message("sendTransaction", data, callback);
    };

    pub.updateContact = function(address, name){
        priv.message("updateContact", {address:address, name:name});
    };

    pub.getContacts = function(callback){
        priv.message("getContacts", {}, callback);
    };

    pub.lookup = function (data, callback){
        priv.message("lookup", data, callback);
    };

    pub.getReddidContacts = function (namespace,callback) {
        priv.message("getReddidContacts", {namespace:namespace}, callback);
    };

    pub.getReddidContactAddress = function (data, callback) {
        priv.message("getReddidContactAddress", data, callback);
    };

    pub.saveSocialProfile = function (profileAndUser, callback){
        priv.message("saveSocialProfile", profileAndUser, callback);
    };

    pub.networks = function(source_page, networkName, authorId, namespace = null){
        priv.message("networks", {source: source_page, network: networkName, uid: authorId, namespace: namespace});
    };

    pub.sendtip = function(networkName, title, url, amount, address, authorName){
        priv.message("sendtip", {network: networkName, title, url, amount, address, authorName});
    };

    pub.getUserIds = function(callback){
        priv.message("getUserIds", {}, callback);
    };

    pub.getUserIdData = function(userid, callback){
        priv.message("getUserIdData", {uid: userid}, callback);
    };

    pub.createUser = function(update,callback){
        priv.message("createUser", {update:update}, callback);
    };

    pub.restoreSocialNetworkSnapshot = function(callback){
        priv.message("restoreSocialNetworkSnapshot", {}, callback);
    };

    pub.saveSocialNetworkSnapshot = function(data, callback){
        priv.message("saveSocialNetworkSnapshot", data, callback);
    };

    pub.clearSocialNetworkSnapshot = function(callback){
        priv.message("clearSocialNetworkSnapshot", {}, callback);
    };

    pub.getSettings = function(callback) {
        priv.message('getSettings', callback);
    };

    pub.setSettings = function(settings, callback) {
        priv.message('setSettings', {settings:settings}, callback);
    };

    pub.setSetting = function(settingKey, settingValue, callback) {
        pub.getSettings(function(settings) {
            settings[settingKey] = settingValue;

            pub.setSettings(settings, function () {
                callback(settings);
            })
        });
        //priv.message('getSettings', callback)
    };

    pub.getReddidStatus = function(callback) {
        priv.message('getReddidStatus', callback);
    };

    /**
    * Function to pass a message to the background process to return the websocket state
    * @param callback
    */
    pub.getconnectionState = function(callback) {
        priv.message('getconnectionState', callback);
    };

    /**
    * Function to pass a message to the background process to return the current release version
    * @param callback
    */
    pub.getReleaseVersion = function(callback) {
        priv.message('getReleaseVersion', callback);
    };

    /**
    * Function to pass a message to the background process to return application state
    * @param userid - username or null
    * @param callback
    * @return {{}}
    */
    pub.getAppState = function(userid, callback) {
        if (typeof arguments[0] === 'function'){
            callback = userid;
            userid = null
        }

        priv.message('getAppState',{uid: userid}, callback);
    };

    /**
    * Function to get the current balance of an address
    * @param address
    * @param callback
    */
    pub.getAddressBalance = function (address, callback) {
        priv.message('getAddressBalance', {address:address}, callback);
    };


    exports.messenger = pub;

})(exports);
