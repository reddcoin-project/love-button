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
            <div class='wallet-transaction'>
                <span class='wallet-transaction-from'>${priv.getAddressLink(transaction.address, transaction.id, 22,  addressNames)}</span>
                <span class='wallet-transaction-date'>${Reddcoin.helpers.formatTime(dateInstance)}</span>
                <span class='wallet-transaction-amount'>${amount.toFixed(8)}</span>
            </div>
        `;
    };


    pub.getView = function(transactions, addressNames){
        let rows = '';

        $.each(transactions, function(i, transaction){
            rows += priv.getWalletHistoryRow(transaction, '');
        });

        return rows;
    };


    exports.viewWalletHistory = pub;

})(exports);
