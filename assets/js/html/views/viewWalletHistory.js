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
        link = `https://live.reddcoin.com/tx/${txid}`;

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

        // ${Reddcoin.helpers.formatTime(dateInstance)}

        var button = `
                <div class="button button--faded button--blue button--icon button--static">
                    <div class="icon icon--rotate90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
                    </div>
                </div>
            `,
            text = 'Received';

        if (amount < 0) {
            button = `
                <div class="button button--faded button--green button--icon button--static">
                    <div class="icon icon--rotate270">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
                    </div>
                </div>
            `;
            text = 'sent';
        }

        return `
            <div class="wallet-table-row">
                ${button}

                <div class="wallet-table-row-details text-list text-list--full">
                    <b class="text text--full">
                        ${text}
                        <span class="right">${amount.toFixed(8)} RDD</span>
                    </b>
                    <span class="text text--full">${priv.getAddressLink(transaction.address, transaction.id, 22,  addressNames)}</span>
                </div>
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
