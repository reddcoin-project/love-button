exports.Appstate = (function () {
    let priv = {
            state: {
                userObj:{},
                useridsObj: {},
                walletObj: {}
            }
        },
        pub = {}
// Private
    /**
     * A private function to return the current state of the user
     * @param userObj
     * @return {{}}
     */
    priv.getUser = function(userObj){

        if (userObj !== null) {
            userObj = JSON.parse(userObj);
            priv.state.userObj = {dataAvailable:true};
        } else {
            priv.state.userObj = {dataAvailable:false};
        }

        return priv.state.userObj
    };
    /**
     * A private function to return the current state of the userids
     * @param useridsObj
     * @return {{}}
     */
    priv.getUserIds = function(userid, useridsObj){

        userid = userid.uid || null;

        if (useridsObj !== null) { // localstorage data available
            useridsObj = JSON.parse(useridsObj);
            priv.state.useridsObj = {
                dataAvailable:true,
                preordered: {},
                registered: {},
                confirmed: {}
            };

            let selectedUser,
                index;

            if (userid !== null) {
                index = useridsObj.findIndex(function (useridObj) {
                    return useridObj.uid === userid.uid
                });
            } else if (userid === null && useridsObj.length > 0){
                index = 0;
            }

            if (index > -1) {
                selectedUser = useridsObj[index];
                priv.state.useridsObj.uid = selectedUser.uid;
                if (selectedUser.preordered !== undefined) {
                    priv.state.useridsObj.preordered = {status:(selectedUser.preordered.status === undefined) ? false : selectedUser.preordered.status};
                }
                if (selectedUser.registered !== undefined) {
                    priv.state.useridsObj.registered = {status: (selectedUser.registered.status === undefined) ? false : selectedUser.registered.status};
                }
                if (selectedUser.confirmed !== undefined) {
                    priv.state.useridsObj.confirmed = {status: (selectedUser.confirmed !== undefined)};
                    priv.state.useridsObj.preordered = {status: true};
                    priv.state.useridsObj.registered = {status: true};
                }
            } else {
                priv.state.useridsObj.uid = null;
                priv.state.useridsObj.preordered = {status: false};
                priv.state.useridsObj.registered = {status: false};
                priv.state.useridsObj.confirmed = {status: false};
            }



        } else {
            priv.state.useridsObj = {dataAvailable:false};
        }

        return priv.state.useridsObj
    };
    /**
     * A private function to return the current state of the wallet
     * @param walletObj
     * @return {{}}
     */
    priv.getWallet = function(walletObj){

        if (walletObj !== null) {
            priv.state.walletObj = {dataAvailable:true};
        } else {
            priv.state.walletObj = {dataAvailable:false};
        }
        return priv.state.walletObj
    };


// Public
    pub.getAppState = function(userid){

        let userObject = localStorage.getItem("user");
        let useridsObject = localStorage.getItem("userids");
        let walletObject = localStorage.getItem("reddcoinWallet");

        priv.getUser(userObject);
        priv.getUserIds(userid, useridsObject);
        priv.getWallet(walletObject);

        let state = priv.state;

        return state;
    };
    return pub;
})();