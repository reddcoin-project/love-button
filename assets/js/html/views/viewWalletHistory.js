/*************************************************
* View to construct wallet history
* Setup initial state and extension settings
*************************************************/

(function (exports) {
	var priv = {
		},
		pub = {};

	priv.getWalletHistoryHeader = function(){

		return '' +
		'<div class="WalletHistoryRow">' +
		'	<div class="WalletHistory">' +
		'		<div class="WalletHistoryDate">Date</div>' +
		'		<div class="WalletHistoryAddress">Address</div>' +
		'		<div class="WalletHistoryAmount">Amount</div>' +
		'	</div>' +
		'</div>';
	};

	priv.getAddressLink = function(address, txid, length, addressNames){

		if(address==null){
			address = 'OP_RETURN';
			//return '<a target="_blank" title="View Address" href="">OP_RETURN fee</a>';
		}

		length = length || 15,
		name = addressNames[address] || address,
		shortened = name.substr(0,length),
		//link = 'http://live.reddcoin.com/address/'+address;
		link = 'http://live.reddcoin.com/tx/'+txid;

		if(name.length > shortened.length){
			shortened += '...'
		}

		return '<a target="_blank" title="View Transaction" href="'+link+'">'+
			shortened
			+'</a>';
	};
	
	priv.getWalletHistoryRow = function(transaction, addressNames) {

		var dateInstance = new Date(transaction.time * 1000)
		var amount = transaction.total * COIN

		return '' +
		'<div class="WalletHistoryRow">' +
		'	<div class="WalletHistory">' +
		'		<div class="WalletHistoryDate">' + Reddcoin.helpers.formatTime(dateInstance) + '</div>' +
		'		<div class="WalletHistoryAddress">' + priv.getAddressLink(transaction.address, transaction.id, 22,  addressNames) + '</div>' +
		'		<div class="WalletHistoryAmount">' + amount.toFixed(8) + '</div>' +
		'	</div>' +
		'</div>';

	};

	pub.getView = function(transactions, addressNames){

		var html = priv.getWalletHistoryHeader();

		$.each(transactions, function(i, transaction){
			html += priv.getWalletHistoryRow(transaction, '');
		});

		return html;
	};

	exports.viewWalletHistory = pub;
})(exports);