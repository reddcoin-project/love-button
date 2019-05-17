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

	priv.getWalletAccountHeader = function(){

		return '' +
		'<div class="WalletHistoryRow">' +
		'	<div class="WalletHistory">' +
		'		<div class="WalletHistoryDate">Date</div>' +
		'		<div class="WalletHistoryAddress">Address</div>' +
		'		<div class="WalletHistoryAmount">Amount</div>' +
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

	priv.getWalletAccountTotals = function(data){
		var confirmed = data.confirmedBalance * COIN;
		var unconfirmed = data.unconfirmedBalance * COIN;
    	return '<div class="WalletBalanceRow">' +
	            '    <div class="WalletAccountRow">' +
	            '        <div class="WalletAccountName">' +
	            '        All Accounts:' +
	            '        </div>' +
	            '        <div class="WalletAccountBalance">' + confirmed.toFixed(8) +
	            '        </div>' +
	            '    </div>' +
	            '    <div class="UnconfirmedRow">' +
	            '        <div class="WalletUnconfirmed">Unconfirmed</div>' +
	            '        <div class="WalletUnconfirmedBalance">' + unconfirmed.toFixed(8) +
	            '        </div>' +
	            '    </div>' +
	            '</div>'
	};

	priv.getWalletAccountRow = function(data) {

		var confirmed = data.confirmed * COIN;
		var unconfirmed = data.unconfirmed * COIN;

		return '<div class="WalletBalanceRow">' +
              '    <div class="WalletAccountRow">' +
              '        <div class="WalletAccountName">' + data.name +
              '        </div>' +
              '        <div class="WalletAccountBalance">' + confirmed.toFixed(8) +
              '        </div>' +
              '    </div>' +
              '    <div class="UnconfirmedRow">' +
              '        <div class="WalletUnconfirmed">Unconfirmed</div>' +
              '        <div class="WalletUnconfirmedBalance">' + unconfirmed.toFixed(8) +
              '        </div>' +
              '    </div>' +
              '</div>'
	};

	pub.getView = function(data){

		var html = priv.getWalletAccountTotals(data);
		//html = priv.getWalletAccountHeader();

		 $.each(data.accounts, function(i, account){
			html += priv.getWalletAccountRow(account, '');
		});
		 
		return html;
	};

	exports.viewWalletAccounts = pub;
})(exports);