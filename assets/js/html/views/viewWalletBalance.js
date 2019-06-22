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


    // Account Details
    priv.getWalletAccountTotals = function(data){
        var confirmed = data.confirmedBalance * COIN,
            unconfirmed = data.unconfirmedBalance * COIN;

        return `
            <div class="wallet-row">
                <div class="wallet-row-section">
                    <span class='wallet-row-title '>All Accounts</span>
                    <span class="wallet-row-balance right">${confirmed.toFixed(8)}</span>
                </div>
                <div class="wallet-row-section">
                    <span class='wallet-row-title'>Unconfirmed</span>
                    <span class="wallet-row-balance right">${unconfirmed.toFixed(8)}</span>
                </div>
            </div>
        `;
    };

    priv.getWalletAccountRow = function(data) {
        var confirmed = data.confirmed * COIN,
            unconfirmed = data.unconfirmed * COIN;

        return `
            <div class="wallet-balance">
                <div class="wallet-balance-section">
                    <span class='wallet-balance-title '>${data.name}</span>
                    <span class="wallet-balance-amount right">${confirmed.toFixed(8)}</span>
                </div>
                <div class="wallet-balance-section">
                    <span class='wallet-balance-title'>Unconfirmed</span>
                    <span class="wallet-balance-amount right">${unconfirmed.toFixed(8)}</span>
                </div>
            </div>

            <div class="wallet-buttons">
                <button class="button button--center button--large button--primary" data-click="frame" data-frame="wallet-send">
                    <div class="icon icon--rotate315">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
                    </div>
                    <span class="inline-spacer inline-spacer--small"></span>
                    Send
                </button>

                <button class="button button--black button--center button--large right" data-click="frame" data-frame="wallet-receive-table">
                    <div class="icon icon--rotate135">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
                    </div>
                    <span class="inline-spacer inline-spacer--small"></span>
                    Receive
                </button>
            </div>
        `;
    };

    pub.getView = function(data){
        var html = ''; //priv.getWalletAccountTotals(data);

        $.each(data.accounts, function(i, account){
            html += priv.getWalletAccountRow(account, '');
        });

        return html;
    };


    exports.viewWalletAccounts = pub;

})(exports);
