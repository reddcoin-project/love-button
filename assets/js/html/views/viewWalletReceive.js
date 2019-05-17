/*************************************************
* View to construct wallet Receive
* Setup initial state and extension settings
*************************************************/

(function (exports) {
	var priv = {
		},
		pub = {};

	priv.getWalletReceiveHeader = function(data, account){
		// Add dropdown for accounts
		var index = account;
		var html = '<p>All addresses listed below belong to this wallet, and may be used as a way of keeping funds separate for ease of use and organization.</p>';
		html += '<select id="getWalletReceiveAccountSelect" class="">'
		var accounts = data.accounts;
		$.each(accounts, function(i, account){
			html += priv.getWalletReceiveAccountRow(account, index);
		});
		html += '</select>'
		return html;
	};
	priv.getWalletReceiveAccountRow = function(account, index) {

		if (account.index == index){
			return '<option value="' + account.index + '"selected>' + account.name + '</option>';
		} else {
			return '<option value="' + account.index + '">' + account.name + '</option>';
		}
	};
	priv.getWalletReceiveAddressRow = function(address, account) {

		return '' +
		'<div class="WalletReceiveAddressRow">' +
		'	<div class="WalletReceive">' +
		'		<div class="WalletReceiveAddress">' + priv.getAddressLink(address.address, 40,  address.name) + ' - ' + address.confirmed * COIN + ' RDD</div>' +
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
	
	

	pub.getView = function(data, account){

		var html = priv.getWalletReceiveHeader(data, account);
		$.each(data.addresses, function(i, address) {
			if (data.addresses[i].accountIndex == account) {
				html += priv.getWalletReceiveAddressRow(address, account);
			}	
		})
		

		/*$.each(transactions, function(i, transaction){
			html += priv.getWalletReceiveRow(transaction, '');
		});
		*/

		return html;
	};

	exports.viewWalletReceive = pub;
})(exports);