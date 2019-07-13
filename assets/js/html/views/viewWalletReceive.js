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
            <p>All addresses listed below belong to this wallet, and may be used as a way of keeping funds separate for ease of use and organization.</p>

            <div class="wallet-field field field--full field--grey" data-focusinout="toggle">
                <label class="field-text field-text--select" data-change="select">
                    <div class="field-mask">${accounts[index].name}</div>

                    <select class="field-tag" id="getWalletReceiveAccountSelect" data-ref="trigger:change">
                        ${fields}
                    </select>
                </label>
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
