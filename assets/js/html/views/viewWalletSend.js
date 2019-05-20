/*************************************************
* Template
* Setup initial state and extension settings for sending
*************************************************/

(function (exports) {

    var priv = {},
        pub = {};


    priv.updateInputs = function(data){
        document.getElementById("walletSend_address").value = '';

        if (data.address !== 'missing') {
            document.getElementById("walletSend_address").value = data.address;
        }
        else {
            let username = data.user;
            let uid = username.slice(0, username.indexOf('.'));
            let namespace = username.slice(username.indexOf('.') + 1);
            var user = {uid: uid, namespace:namespace};
            
            exports.messenger.lookup(user, function (response) {
                document.getElementById("walletSend_address").value = response.address;
            });
        }
    };

    priv.createContactList = function(data){
        document.getElementById("contacts").innerHTML = ''

        var html = '';
        var contacts = data.contacts;

        for (var key in contacts) {
            html += '<option value="' + contacts[key] + '" data-value="' + key + '"></option>'
        }

        document.getElementById("contacts").innerHTML = html;
    };

    priv.updateContactList = function(data){
        var html = document.getElementById("contacts").innerHTML
        var contacts = data.results

        for (var key in contacts) {
            html += '<option value="' + contacts[key] + '" data-value="missing"></option>'
        }

        document.getElementById("contacts").innerHTML = html;
    }


    pub.getView = function(data){
        if(data.contacts){
            priv.createContactList(data);
        }
        else if (data.user){
            priv.updateInputs(data)
        }
        else if (data.results){
            priv.updateContactList(data);
        }
    };


    exports.viewWalletSend = pub;

})(exports);
