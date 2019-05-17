/*************************************************
 * View to construct wallet history
 * Setup initial state and extension settings
 *************************************************/

(function (exports) {
  var priv = {
      uid: '',
      status: '',
      available: false,
      cost: 0,
      error: '',
      balance: 0,
      indexing: true,
      maxNameLength: 37,
      defaultNamespace: ".tester",
      state: {
        ui: [
          {
            redd_id_input: {
              value: '',
              state: 'enabled'
            }
          },
          {
            redd_id_value: {
              value: '',
              state: 'disabled'
            }
          },
          {
            id_msg: {
              value: '',
              title: '',
              state: 'enabled'
            }
          },
          {
            redd_id_btn_order: {
              value: '',
              state: 'enabled'
            }
          },
          {
            redd_id_btn_register: {
              value: '',
              state: 'enabled'
            }
          },
          {
            redd_id_btn_cancel: {
              value: '',
              state: 'enabled'
            }
          },
          {
            owning_address_input: {
              value: '',
              state: 'disabled'
            }
          },
          {
            paying_address_input: {
              value: '',
              state: 'disabled'
            }
          },
          {
            error_msg_txt: {
              value: '',
              state: 'enabled'
            }
          }
        ],
        network: {}
      }
    },
    pub = {};

// Private
	/**
	 * Function to return the array element from UI state
	 * @param elementname - text ID of the element
	 * @returns {number} - index of array
	 */
	priv.getStateIndex = function (elementname) {
		return priv.state.ui.findIndex(function (element) {
			return (elementname in element)
		});
	};
	/**
	 * Function to set the UI state
	 * @param element - the element ID
	 * @param key - the key to set
	 * @param value - the value to set
	 */
	priv.setStateValue = function (element, key, value) {
		priv.state.ui[priv.getStateIndex(element)][element][key] = value;
	};
	/**
	 * Function to set the UI state variables true/false to enabled/disabled
	 * @param elementState
	 * @returns {string}
	 */
	priv.getElementDisabledState = function (elementState) {
		if (elementState !== true) {
			return 'enabled'
		}

		return 'disabled'
	};
  pub.setDefaults = function () {

    Reddcoin.messenger.getAppState(null, response => {
      debug.log(`${JSON.stringify(response)}`);
      priv.state.network = response;
      networkState = priv.state.network;
      //Check the status of the wallet
      if (networkState.walletObj.dataAvailable) {
        debug.log(`Wallet available`);
        $('#redd_id_btn_register').show();
        $('#redd_id_btn_order').show();

        const wallet = JSON.parse(localStorage.reddcoinWallet);

        //owning address
        $('#owning_address_input').val(wallet.accounts[0].addresses[0].address);
        priv.setStateValue('owning_address_input', 'value', wallet.accounts[0].addresses[0].address);
        //paying address
        $('#paying_address_input').val(wallet.accounts[0].addresses[1].address);
        priv.setStateValue('paying_address_input', 'value', wallet.accounts[0].addresses[1].address);

        pub.getPayingAddrBalance();

        Reddcoin.messenger.getUserIds(function(result){
          let maxIds = 25;
          $("#regoCount_txt").text(`${result.length} of ${maxIds} registered`)
        })

      } else {
        debug.log(`Wallet not available`);
        $('#redd_id_btn_register').hide();
        $('#redd_id_btn_order').hide();

        //owning address
        $('#owning_address_input').val('Please create or import a wallet');
        $('#owning_address_input').prop('disabled', true);
        priv.setStateValue('owning_address_input', 'value', 'Please create or import a wallet');
        priv.setStateValue('owning_address_input', 'state', 'disabled');

        //paying address
        $('#paying_address_input').val('Please create or import a wallet');
        $('#paying_address_input').prop('disabled', true);

        priv.setStateValue('paying_address_input', 'value', 'Please create or import a wallet');
        priv.setStateValue('paying_address_input', 'state', 'disabled');
      }

      //$('#id_msg').text(`Please enter a name.`);
      $('#redd_id_btn_order').prop('disabled', true);
      $('#redd_id_btn_register').prop('disabled', true);
      $('#redd_id_btn_cancel').prop('disabled', true);
      $("#orderLoading").hide();

      priv.setStateValue('redd_id_btn_order', 'state', 'disabled');
      priv.setStateValue('redd_id_btn_register', 'state', 'disabled');
      priv.setStateValue('redd_id_btn_cancel', 'state', 'disabled');

    });
  };

	priv.getResult = function(data) {

	var balance = data.addresses[1].confirmed;
	var rdd = balance * COIN;
	var html = "Balance: " + rdd.toFixed(8) + " RDD";
	priv.balance = balance

	return html;
	};
	priv.getBlockchainUserIds = function() {
		var html = '';
		Reddcoin.messenger.getUserIds(function(ids) {
			ids.forEach(function(userid) {
				html += '<option value="' + userid + '">' + userid + '</option>'
			});
			document.getElementById('selectBlockchainUserIds').innerHTML = html
		});
	};
	priv.getBlockchainRecordHeader = function (){
		return '' +
		'<div class="BlockchainRecordRow">' +
		'	<div class="BlockchainRecord">' +
		'		<div class="BlockchainRecordKey">Key</div>' +
		'		<div class="BlockchainRecordKey">Value</div>' +
		'	</div>' +
		'</div>';

	};
	priv.getBlockchainRecordRow = function (key, value) {
		return '' +
		'<div class="BlockchainRecordRow">' +
		'	<div class="BlockchainRecord">' +
		'		<div class="BlockchainRecordKey">' + key + '</div>' +
		'		<div class="BlockchainRecordKey">' + value + '</div>' +
		'	</div>' +
		'</div>';
	}
	pub.displayBlockchainRecord = function (user) {

		var blockchainrecord = user.confirmed

		var html = '<div class="reddidPopupPage_Body">' +
					'<div class="reddidPopupPage_Data">' +
					'<h2>Blockchain Record</h2>' +
					'<select id="selectBlockchainUserIds" name="userids">' +
					'</select>'

		html +=	'<div class="BlockchainRecordTable">'

		html += priv.getBlockchainRecordHeader();

		for (row in blockchainrecord) {
			html += priv.getBlockchainRecordRow (row, blockchainrecord[row])
		}

		html += '</div>' +
				'</div>' +
				'</div>'

		document.getElementById('reddidPopupRegistered').innerHTML = html
		priv.getBlockchainUserIds();
	};
  priv.checkAllowedChars = function (name, namespace) {
    const allowedChars = /^[\da-z-_]*$/;
    if (!name.match(allowedChars)) {
      document.getElementById('id_msg').innerText = "The name can only contain lower-case letters, digits, hyphens and underscores.";
      //document.getElementById('redd_id_btn_order').disabled = true;
      //document.getElementById('redd_id_btn_register').disabled = true;
      return false;
    }
    //document.getElementById('redd_id_btn_order').disabled = false;
    //document.getElementById('redd_id_btn_register').disabled = false;
    return true
  };
  priv.checkLength = function (name, namespace) {
    const maxNameLength = 37;
    var fqn = name + namespace;

    if (name.length < 1) {
      $('#id_msg').text("Please enter a name.");
      $('#redd_id_balance').removeAttr('style');
      //document.getElementById('redd_id_btn_order').disabled = true;
      return false
    } else if (fqn.length > priv.maxNameLength) {
      $('#id_msg').text(`The name ${name} is too long. Maximum length allowed ${priv.maxNameLength - namespace.length} chars. Your name is ${name.length} chars`);
      //document.getElementById('redd_id_btn_order').disabled = true;
      //document.getElementById('redd_id_btn_register').disabled = true;
      return false
    }
    //document.getElementById('redd_id_btn_order').disabled = false;
    //document.getElementById('redd_id_btn_register').disabled = false;
    return true;
  };

  priv.checkBalance = function () {
    if (priv.cost > priv.balance) {
      $('#id_msg').text(`Cost: ${priv.cost * COIN} is > ${priv.balance * COIN}`);
      return false;
      //document.getElementById('redd_id_btn_order').disabled = true;
    } else {
      $('#id_msg').text(`Cost: ${priv.cost * COIN} is <  ${priv.balance * COIN}`);
      //document.getElementById('redd_id_btn_order').disabled = false;
    }
    return true;
  };

  priv.updateStatus = function (data) {

    let id_uid,
      id_msgText,
      id_msgTitle,
      id_value,
      id_btnOrderDisable,
      id_btnRegisterDisable;

    priv.uid = data.uid;
    priv.status = data.status;

    if (data.uid === "") {
      $('#redd_id_balance').removeAttr('style');
      id_msgText = `Please enter a name.`
    } else {
      switch (data.status) {
        case "not found":

          console.log("Status: " + data.status);
          console.log("ID Cost: " + data.cost.est_totalcost);
          console.log("UID: " + data.uid);
          if (data.error) {
            priv.available = false;
            id_msgText = data.error;
            id_btnOrderDisable = true;
            id_btnRegisterDisable = true;

            console.log("Error: " + data.error);
            document.getElementById('id_msg').innerText = data.error;
            console.log("Error: " + data.error);
            document.getElementById('redd_id_btn_order').disabled = true;
          } else {
            priv.available = true;
            priv.cost = data.cost.est_totalcost;

            id_uid = data.uid.substring(0, data.uid.indexOf('.'));
            id_msgText = data.uid + " is available. Cost: " + (data.cost.est_totalcost * COIN) + " RDD";
            id_msgTitle = "Cost is made up of the following: Base Price (" + (data.cost.satoshis * COIN) + " RDD) Est. fee (" + (data.cost.est_fees * COIN) + " RDD) + Dev Subsidy (" + (data.cost.opt_subsidy * COIN) + " RDD)";
            id_value = (data.cost.est_totalcost * COIN) + " RDD";

            if (priv.cost <= priv.balance) {
              id_btnOrderDisable = false;
              $('#redd_id_balance').css('background-color', '#82ff8224');
            } else {
              id_msgText += " RDD. Balance too low.";
              id_btnOrderDisable = true;
              $('#redd_id_balance').css('background-color', '#ff000024');
            }
          }

          break;
        case "found":
          priv.available = false;
          console.log("found: " + data.uid)
          id_msgText = data.uid + " not available.";
          id_btnOrderDisable = true;
          break;
      }
    }

    $('#id_msg').text(id_msgText);
    $('#redd_id_value').prop('title', id_msgTitle);
    $('#redd_id_value').val(id_value);
    $('#redd_id_btn_order').prop('disabled',id_btnOrderDisable);
    $('#redd_id_btn_register').prop('disabled',id_btnRegisterDisable);

    priv.setStateValue('id_msg', 'value', id_msgText);
    priv.setStateValue('id_msg', 'title', id_msgTitle);
    priv.setStateValue('redd_id_value', 'value', id_value);
    priv.setStateValue('redd_id_btn_order', 'state', id_btnOrderDisable);

  };
	priv.updateTransaction = function(data) {
		if (data) {
			switch (data.request.reddTx) {
                case 'preorder':
                    debug.log("Setting Preorder data:")
                    if (data.response.result === ""){
                    	document.getElementById('error_msg').innerHTML = "Error sending Preorder transaction, check available inputs";
                    } else {
                    	document.getElementById('error_msg').innerHTML = "Transaction Sent: " + data.response.result;
                    }
                    break;
                case 'register':
                    debug.log("Setting Register data:")
                    if (data.response.result === ""){
                    	document.getElementById('error_msg').innerHTML = "Error sending Register transaction, check available inputs";
                    } else {
                    	document.getElementById('error_msg').innerHTML = "Transaction Sent: " + data.response.result;
                    }
                    break;
            }
		}
	};

	priv.updateOrderStatus = function(data) {
		if (data) {
			var user = data.user;
      
			if (document.getElementById('redd_id_btn_order')) {
				document.getElementById('redd_id_btn_order').disabled = true;
			}
			if (document.getElementById('redd_id_btn_register')) {
				document.getElementById('redd_id_btn_register').disabled = true;
			}
      
			if (user.error) {
			    document.getElementById('id_msg').innerText = user.error;
			} else if(user.confirmed && user.confirmed.address) {
				pub.displayBlockchainRecord(user)
			} else if (user.preordered.status === false) {
				document.getElementById('order_breadcrumb_txt').innerText = "Order => PreOrder Sent";
			} else if (user.preordered.status === 'pending') {
			    document.getElementById('id_msg').innerText = user.uid + " Preorder tx has been sent. Waiting for first tx confirmation";
			    document.getElementById('order_breadcrumb_txt').innerText = "Order => PreOrder Sent => Waiting"
			} else if (user.preordered.status === true && user.registered.status === false) {
				document.getElementById('id_msg').innerText = user.uid + " preorder tx is confirmed on block : " + user.preordered.height;
				document.getElementById('order_breadcrumb_txt').innerText = "Order => PreOrder Sent => Waiting => Confirmed on block : " + user.preordered.height;
			    document.getElementById('redd_id_btn_register').disabled = false;
			} else if (user.registered.status === 'pending') {
				document.getElementById('id_msg').innerText = user.uid + " register tx has been sent. Waiting for first tx confirmation";
				document.getElementById('register_breadcrumb_tx').innerText = "Register Sent => Waiting"
			} else if (user.registered.status === true) {
			    document.getElementById('id_msg').innerText = user.uid + " register tx is confirmed on block : " + user.registered.height;
			    document.getElementById('register_breadcrumb_tx').innerText = "Register Sent => Waiting => Confirmed on block : " + user.registered.height;
			} else if (user.error) {
				document.getElementById('id_msg').innerText = user.error;
			}
		}
	};
  priv.updateRegistrationStatus = function (data) {

    data = data.registration;

    if (data.preorder && !Object.keys(data.preorder).length) { // preordering has not started
      $("#orderLoading").hide();
      $('#redd_id_btn_order').prop('disabled', false);
      $('#redd_id_btn_register').prop('disabled', true);
      $('#id_msg').text(`Please enter a name.`);
      $('#redd_id_input').prop('disabled', false);
    } else if (data.preorder && data.preorder.init && data.preorder.init === true) { // disable buttons Preordering started, cannot register manually
      $("#orderLoading").show();
      $('#redd_id_btn_order').prop('disabled', true);
      $('#redd_id_btn_register').prop('disabled', true);
      $('#id_msg').text(`Pre-ordering has started, Check Status history`);
      $('#redd_id_input').prop('disabled', true);
    } else if (data.preorder && data.preorder.init && data.preorder.init === true && data.preorder.complete && data.preorder.complete === true){
      $('#redd_id_btn_order').prop('disabled', true);
      $('#redd_id_btn_register').prop('disabled', false);
      $('#id_msg').text(`Pre-ordering complete, Check Status history`);
      $('#redd_id_input').prop('disabled', true);
    }

    if (data.register && data.register.init && data.register.init === true && data.register.complete && data.register.complete === false){
      $('#redd_id_btn_order').prop('disabled', true);
      $('#redd_id_btn_register').prop('disabled', true);
      $('#id_msg').text(`Registering started, Check Status history`)
      $('#redd_id_input').prop('disabled', true);
    } else if (data.register && data.register.init && data.register.init === true && data.register.complete && data.register.complete === true){
      $("#orderLoading").hide();
      $('#redd_id_btn_order').prop('disabled', true);
      $('#redd_id_btn_register').prop('disabled', true);
      $('#id_msg').text(`Registering complete, Check Status history`)
      $('#redd_id_input').prop('disabled', false);
    }

    let table = "<table>";
    let tableHeader = "<tr><th id='reddidRegistration_col1'>Operation</th><th id='reddidRegistration_col2'>Step</th><th id='reddidRegistration_col3'>Value</th></tr>";
    let tableContent = "";
    let tableFooter = "</table>";
    let section;

    for (section in data) {
      let subsection;
      for (subsection in data[section]) {
        tableContent = tableContent + `<tr><td id='reddidRegistration_col1'>${section}</td><td id='reddidRegistration_col2'>${subsection}</td><td id='reddidRegistration_col3'>${data[section][subsection]}</tr>`;
      }
    }
    document.getElementById("StatusOverlay-table").innerHTML = table + tableHeader + tableContent + tableFooter;
  };

// Public
	pub.cancelId = function() {
		/* Cancel the registration process*/
		document.getElementById('redd_id_input').disabled = false;
    document.getElementById('redd_id_input').value = '';
    document.getElementById('redd_id_btn_order').disabled = false;
    document.getElementById('redd_id_btn_register').disabled = true;
    document.getElementById('id_msg').innerText = '';
	};
	pub.orderId = function() {
		// basic field checking !zero and not already registered
		const uid = document.getElementById('redd_id_input').value;
		if (uid.length === 0 ) {
			document.getElementById('id_msg').innerText = "Please provide a name to register.";
			return false;
		}

		if (!priv.checkAllowedChars(uid)) {
			return false
		}
		
		if (priv.status == 'found') {
			document.getElementById('id_msg').innerText = "Name already registered, try another.";
			return false;
		}

		if (priv.indexing == true) {
			document.getElementById('id_msg').innerText = "Indexing. Please wait";
			return false;
		}

		// We are workign with this ID so disable the input field
		document.getElementById('redd_id_input').disabled = true;
		document.getElementById('redd_id_btn_cancel').disabled = true;
		document.getElementById('redd_id_btn_order').disabled = true;

		return true;
	}
	pub.registerId = function() {
		return true;
	};
  pub.checkName = function (name, namespace) {

    priv.available = false;
    $('#id_msg').text(`Checking availablity of ${name}${namespace}`);
    $('#redd_id_btn_order').prop('disabled', true);

    if (!priv.checkAllowedChars(name, namespace)) {
      return false
    }
    if (!priv.checkLength(name, namespace)) {
      return false
    }
    /*		if (!priv.checkBalance()){
          return false
        }*/
    return true;
  };
  pub.getPayingAddrBalance = function () {
    Reddcoin.messenger.getAddressBalance($('#paying_address_input').val(), function(data) {
      priv.balance = data.balance.confirmed;
      $('#redd_id_balance').val(`${data.balance.confirmed * COIN} RDD`)
    });

    window.setInterval(function () {
      Reddcoin.messenger.getAddressBalance($('#paying_address_input').val(), function(data) {
        priv.balance = data.balance.confirmed;
        $('#redd_id_balance').val(`${data.balance.confirmed * COIN} RDD`)
      })
    },5000);

  };
	pub.getView = function(data){

	  if (data.action === 'open') {
	  	pub.setDefaults();
		} else if (data.status) {
			priv.updateStatus(data);
		} else if (data.request) {
			priv.updateTransaction(data);
		} else if (data.registration){
			priv.updateRegistrationStatus(data);
		}else if (data.user){
			priv.updateOrderStatus(data);
	    } else if (data.confirmed){
	    	pub.displayBlockchainRecord(data)
			//priv.updateOrderConfirmed(data);
	    } else if (data.error) {
	        console.log('rendering error')
	        document.getElementById('id_msg').innerText = data.error;
	    } else {
			var html = ''
			return html
		}

    let newTitle = 'This is the name that you will receive tips associated with your wallet.';
    $('#redd_id_input').attr('title', `${newTitle} Up to ${priv.maxNameLength - priv.defaultNamespace.length} chars`);

	};
/*
  // set a timer to poll for network index status 2secs
  window.setInterval(function () {
    Reddcoin.messenger.getBlockheight(function (msg) {
      console.log('Value of height is ' + JSON.stringify(msg));

      if (msg.indexing == true) {
        priv.indexing = true;
        $('#error_msg_txt').text(`Reddid Indexing. Blockchain = ${msg.bitcoind_blocks}. ReddID = ${msg.last_block}`);
        $('#redd_id_btn_order').prop('disabled', true);
        priv.setStateValue('error_msg_txt', 'value', `Reddid Indexing. Blockchain = ${msg.bitcoind_blocks}. ReddID = ${msg.last_block}`);

      } else {
        priv.indexing = false;
        $('#error_msg_txt').text(``);
        if($('#redd_id_input').val() === '' || priv.available === false){
          $('#redd_id_btn_order').prop('disabled', true);
        } else {
          $('#redd_id_btn_order').prop('disabled', false);
        }

        priv.setStateValue('error_msg_txt', 'value', ``);
      }
    });
    if($('#paying_address_input').val() !== ''){
      Reddcoin.messenger.getAddressBalance($('#paying_address_input').val(), function(data) {
        priv.balance = data.balance.confirmed;
        $('#redd_id_balance').val(`${data.balance.confirmed * COIN} RDD`)

      })
    }
  }, 2000);
  */
	exports.viewWalletRegister = pub;
})(exports);