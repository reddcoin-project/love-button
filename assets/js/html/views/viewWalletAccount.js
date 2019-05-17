/*************************************************
* View to construct wallet Account
* Setup initial state and extension settings
*************************************************/

(function (exports) {
	var priv = {
		},
		pub = {};

	priv.getWalletAccountHeader = function(data){

		return '' +
		'<div class="WalletAccountRow">' +
		'	<div class="WalletAccount">' +
		'		<div class="WalletAccountDate">Date</div>' +
		'		<div class="WalletAccountAddress">Address</div>' +
		'		<div class="WalletAccountAmount">Amount</div>' +
		'	</div>' +
		'</div>';
	};

	priv.getAddressLink = function(address, length, addressNames){
		var length = length || 15,
			name = addressNames[address] || address,
			shortened = name.substr(0,length),
			link = 'http://live.reddcoin.com/address/'+address;

		if(name.length > shortened.length){
			shortened += '...'
		}

		return '<a target="_blank" title="View Address" href="'+link+'">'+
			shortened
			+'</a>';
	};
	
	priv.getWalletAccountRow = function(transaction, addressNames) {

		var dateInstance = new Date(transaction.time * 1000)
		var amount = transaction.total * COIN

		return '' +
		'<div class="WalletAccountRow">' +
		'	<div class="WalletAccount">' +
		'		<div class="WalletAccountDate">' + Reddcoin.helpers.formatTime(dateInstance) + '</div>' +
		'		<div class="WalletAccountAddress">' + priv.getAddressLink(transaction.address, 22,  addressNames) + '</div>' +
		'		<div class="WalletAccountAmount">' + amount.toFixed(8) + '</div>' +
		'	</div>' +
		'</div>';

	};

	pub.getView = function(data){

		var html = priv.getWalletAccountHeader(data);

		$.each(transactions, function(i, transaction){
			html += priv.getWalletAccountRow(transaction, '');
		});

		return html;
	};

	exports.viewWalletAccounts = pub;
})(exports);