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
            <div class="wallet-balance">
                <div class="wallet-balance-section">
                    <span class='wallet-balance-title'>All Accounts Balance</span>
                    <span class="wallet-balance-amount right">${confirmed.toFixed(8)}</span>
                </div>
                <div class="wallet-balance-section">
                    <span class='wallet-balance-title'>Unconfirmed</span>
                    <span class="wallet-balance-amount right">${unconfirmed.toFixed(8)}</span>
                </div>
            </div>
        `;
    };

    priv.getWalletAccountRow = function(data) {
        var confirmed = data.confirmed * COIN,
            unconfirmed = data.unconfirmed * COIN;

        // ${unconfirmed.toFixed(8)}
        // ${data.name}

        return `
            <div class="wallet-header page-header page-header--center">
                <span class="page-header-category">RDD Balance</span>
                <h2 class="page-header-title">${confirmed.toFixed(8)}</h2>
            </div>

            <div class="wallet-buttons">
                <button class="button button--center button--large button--grey" data-click="frame" data-frame="wallet-send" data-click="frame" data-frame="wallet-send">
                    <div class="icon icon--rotate270 icon--green">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
                    </div>
                    <span class="inline-spacer inline-spacer--small"></span>
                    <b>Send</b>
                </button>

                <button class="button button--center button--large button--grey right" data-click="frame" data-frame="wallet-receive-table" data-click="frame" data-frame="wallet-receive-table">
                    <div class="icon icon--rotate90 icon--blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
                    </div>
                    <span class="inline-spacer inline-spacer--small"></span>
                    <b>Receive</b>
                </button>
            </div>
        `;
    };

    pub.getView = function(data){
        var html = '';//priv.getWalletAccountTotals(data);

        $.each(data.accounts, function(i, account){
            html += priv.getWalletAccountRow(account, '');
        });

        return html;
    };


    exports.viewWalletAccounts = pub;

})(exports);
