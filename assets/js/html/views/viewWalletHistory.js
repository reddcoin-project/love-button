/*************************************************
* View to construct wallet history
* Setup initial state and extension settings
*************************************************/

(function (exports) {

    var priv = {},
        pub = {};


    priv.getAddressLink = function(address, txid, length, addressNames){
        if(address==null){
            address = 'OP_RETURN';
        }

        length = length || 15,
        name = addressNames[address] || address,
        link = `http://live.reddcoin.com/tx/${txid}`;

        return `
            <a class='link link--inline link--primary tooltip' data-hover='toggle' target="_blank" href="${link}">
                ${name}

                <span class='tooltip-content tooltip-content--message tooltip-content--nw'>View Transaction</span>
            </a>
        `;
    };

    priv.getWalletHistoryRow = function(transaction, addressNames) {
        var dateInstance = new Date(transaction.time * 1000),
            amount = transaction.total * COIN

        return `
            <div class='table-row table-row--grey-light'>
                <span class='wallet-interact-history-date table-item'>${Reddcoin.helpers.formatTime(dateInstance)}</span>
                <span class='wallet-interact-history-address table-item'>${priv.getAddressLink(transaction.address, transaction.id, 22,  addressNames)}</span>
                <span class='wallet-interact-history-amount table-item'>${amount.toFixed(8)}</span>
            </div>
        `;
    };


    pub.getView = function(transactions, addressNames){
        let rows = '';

        $.each(transactions, function(i, transaction){
            rows += priv.getWalletHistoryRow(transaction, '');
        });

        return `
            <div class='wallet-interact-history table'>
                <div class='table-header table-header--black'>
                    <span class='wallet-interact-history-date table-item'>Date</span>
                    <span class='wallet-interact-history-address table-item'>Address</span>
                    <span class='wallet-interact-history-amount table-item'>Amount</span>
                </div>

                ${rows}
            </div>
        `;
    };


    exports.viewWalletHistory = pub;

})(exports);
