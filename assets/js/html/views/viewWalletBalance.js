/*************************************************
* View to construct account balance
* Setup initial state and extension settings
*************************************************/

(function (exports) {

    var priv = {
            confirmed : 0,
            unconfirmed : 0
        },
        pub = {};


    priv.getWalletAccountTotals = function(data){
        var confirmed = data.confirmedBalance * COIN,
            unconfirmed = data.unconfirmedBalance * COIN;

        return `
            <div class="wallet-interact-row">
                <div class="wallet-interact-row-section">
                    <span class='wallet-interact-row-title '>All Accounts</span>
                    <span class="wallet-interact-row-balance right">${confirmed.toFixed(8)}</span>
                </div>
                <div class="wallet-interact-row-section">
                    <span class="wallet-interact-row-balance right">${unconfirmed.toFixed(8)}</span>
                    <span class='wallet-interact-row-title right'>Unconfirmed</span>
                </div>
            </div>
        `;
    };

    priv.getWalletAccountRow = function(data) {
        var confirmed = data.confirmed * COIN,
            unconfirmed = data.unconfirmed * COIN;

        return `
            <div class="wallet-interact-row">
                <div class="wallet-interact-row-section">
                    <span class='wallet-interact-row-title '>${data.name}</span>
                    <span class="wallet-interact-row-balance right">${confirmed.toFixed(8)}</span>
                </div>
                <div class="wallet-interact-row-section">
                    <span class="wallet-interact-row-balance right">${unconfirmed.toFixed(8)}</span>
                    <span class='wallet-interact-row-title right'>Unconfirmed</span>
                </div>
            </div>
        `;
    };

    pub.getView = function(data){
        var html = priv.getWalletAccountTotals(data);

        $.each(data.accounts, function(i, account){
            html += priv.getWalletAccountRow(account, '');
        });

        return html;
    };


    exports.viewWalletAccounts = pub;

})(exports);
