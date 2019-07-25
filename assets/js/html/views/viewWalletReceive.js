/*************************************************
* View to construct wallet Receive
* Setup initial state and extension settings
*************************************************/

(function (exports) {

    var priv = {},
        pub = {};


    priv.getWalletReceiveHeader = function(data, account){
        var accounts = data.accounts,
            fields = '',
            index = account;

        $.each(accounts, function(i, account){
            fields += priv.getWalletReceiveAccountRow(account, index);
        });

        return `
            <button class="frame-button frame-button--left button button--white button--icon button--small" data-click="frame" data-frame="wallet-balances" style='margin: -2px 0;z-index: 2;'>
                <div class="icon icon--rotate180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>            </div>
            </button>

            <div class="page-header page-header--center">
                <h3 class="page-header-title">Receive</h3>
            </div>

            <div class="wallet-field wallet-field--first field field--full field--grey" data-focusinout="toggle">
                <label class="field-text field-text--select" data-change="select">
                    <div class="field-mask">${accounts[index].name}</div>

                    <select class="field-tag" id="getWalletReceiveAccountSelect" data-ref="trigger:change">
                        ${fields}
                    </select>
                </label>
            </div>

            <div class="page-header" style='margin-top: 32px;'>
                <h5 class="page-header-title">Address</h5>
            </div>
        `;
    };

    priv.getWalletReceiveAccountRow = function(account, index) {
        if (account.index == index){
            return '<option value="' + account.index + '"selected>' + account.name + '</option>';
        }
        else {
            return '<option value="' + account.index + '">' + account.name + '</option>';
        }
    };

    priv.getWalletReceiveAddressRow = function(address, account) {
        return `
            <div class="wallet-row wallet-interact-row--small">
                <div class='wallet-row-title'>${priv.getAddressLink(address.address, 40,  address.name)}</div>
                <span class="wallet-row-balance">${address.confirmed * COIN} RDD</span>
            </div>
        `;
    };

    priv.getAddressLink = function(address, length, addressNames){
        var length = length || 15,
            name = addressNames[address] || address,
            shortened = name.substr(0,length),
            link = 'https://live.reddcoin.com/address/' + address;

        if(name.length > shortened.length){
            shortened += '...'
        }

        return `
            <a class='link link--inline link--primary tooltip' data-hover='toggle' target="_blank" href="${link}">
                ${shortened}

                <span class='tooltip-content tooltip-content--message tooltip-content--nw'>View Address</span>
            </a>
        `;
    };


    pub.getView = function(data, account){
        var html = priv.getWalletReceiveHeader(data, account);

        $.each(data.addresses, function(i, address) {
            // ICJR: Hiding Wallet Addresses To Reduce Complexity
            if (data.addresses[i].accountIndex == account && i < 2) {
                html += priv.getWalletReceiveAddressRow(address, account);
            }
        })

        return html;
    };


    exports.viewWalletReceive = pub;

})(exports);
