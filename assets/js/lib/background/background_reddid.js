/*************************************************
* Redd ID
* Setup function and state extension settings
*************************************************/
(function () {
	var priv = {
		userStorageKey: 'user',
		useridsStorageKey: 'userids',
		reddidContactStorageKey: 'reddidContacts',
		user: {
			uid : '',
			status : '',
			error : '',
			satoshis : 0,
			preordered : {
				status: false,
				tx: "",
				tx_hash: "",
				height: 0,
				data:""
				},
			registered : {
				status: false,
				tx: "",
				tx_hash: "",
				height: 0,
				data: ""
				},
			confirmed : {
			    },
			updated : {
				status: false,
				tx: '',
				tx_hash: '',
				value_hash: '',
				height: 0,
				data: ''
				},
		    profile : {
		    	name : {
		    		formatted : ""
		    	    },
		    	networks : {
		    		},
		    	v : 2
		        }
			},
		profileTemplate: {
			name : {
				formatted : ""
			},
			networks : {
			},
			v : 2
			},
		userids : []
		},
		pub = {};

	var defaults = priv;

// private
	priv.getOwningAddress = function() {
		if (localStorage.reddcoinWallet) {
			var wallet = JSON.parse(localStorage.reddcoinWallet)
			return wallet.accounts[0].addresses[0].address;
		}
	};
	// if owner,  owner = true, else owner = false
	// when using update details, it needs the owner to sign
	priv.getPublicKey = function(owner = false) {

		if (owner === true) {
			index = 0
		} else {
			index = 1
		};
		if (localStorage.reddcoinWallet) {
			var wallet = JSON.parse(localStorage.reddcoinWallet)
			return wallet.accounts[0].addresses[index].data.pub;
		}
	};
	priv.orderId = function(data) {
		priv.user.uid = data.uid;

		debug.log("Pre-ordering: " + priv.uid)
		var pre = {};

		/* Preoder requires {
			[userid], to rgister
			[publickey], of address that will sign
			[address], that will own
		}
			*/

		owningAddr = priv.getOwningAddress();
		pre.owningAddr = owningAddr;


		publicKey = priv.getPublicKey();
		pre.publicKey = publicKey;

		pre.uid = priv.user.uid;

		priv.processOrder(pre);

	};
	priv.registerId = function(data) {
		priv.user.uid = data.uid;

		debug.log("Registering: " + priv.uid)
		var pre = {};

		owningAddr = priv.getOwningAddress();
		pre.owningAddr = owningAddr;

		publicKey = priv.getPublicKey();
		pre.publicKey = publicKey;

		pre.uid = priv.user.uid;

		priv.processRegister(pre);
	};
	priv.processOrder = function(user) {
		//start order process loop
		// pre-order
		// order
		// takes at least 6 blocks
		debug.log("Processing-order: " + user)

		/*
		socket.emit('preoder', user);

		socket.emit('register', user);
		*/
		// poll the order process every 10sec
		if (priv.user.preordered.status == false & priv.user.registered.status == false) {
			debug.log("Sending Pre-Order");
			priv.updateInterface();
			//TODO remove socket.io reference
			// socket.emit('preorder', user);



		}

/*
		var startOrdering = window.setInterval(function() {
			debug.info("Process Order\n  preordered = " + priv.user.preordered.status + "\n  tx_hash = " + priv.user.preordered.tx_hash);
			debug.info("  registered = " + priv.user.registered.status + "\n  tx_hash = " + priv.user.registered.tx_hash);

			if (priv.user.preordered.status == false & priv.user.registered.status == false) {
				debug.log("Sending Pre-Order");
				priv.user.preordered.status = 'pending';

				socket.emit('preorder', user);
				priv.saveUser();
			}

			if (priv.user.preordered.status == 'pending' & priv.user.registered.status == false) {
				debug.log("Waiting for Pre-Order tx")
			}
			// Have received preordered tx - wait 6 conf and then register
			if (priv.user.preordered.status == true & priv.user.registered.status == false) {
				debug.log("Sending Register");
				socket.emit('register', user);
				priv.saveUser();

			}


		}, 10000); // retry every 10 sec
*/

	};

	priv.processRegister = function(user) {
		debug.log("Processing-order: " + user)
		debug.log("Sending Register");
		priv.updateInterface();
		socket.emit('register', user);
	};

	priv.processUpdateProfile = function(profile, uid) {
		var data = {};
		debug.log("Processing-update: " + uid)
		debug.log("Sending Update");
		data.user = uid;
		data.publicKey = priv.getPublicKey(true); //owners public key
		data.profile = profile;
		if (priv.user.updated.tx_hash.length !== 0) {
			data.tx_hash = priv.user.updated.tx_hash
		}
		socket.emit('update', data);
	};

	priv.saveUser = function() {
		debug.log("Saving User")
        debug.log(priv.user);
        localStorage.setItem(priv.userStorageKey, JSON.stringify(priv.user));
        localStorage.setItem(priv.useridsStorageKey, JSON.stringify(priv.userids))

	};

	priv.setreddIdTx = function(data) {
		let index;
		if (data) {
			switch (data.request.reddTx) {
                case 'preorder':
                    debug.log("Setting Preorder data:");
					index = priv.userids.findIndex(function (userid) {
						if(userid.preordered !== undefined){
							return userid.preordered.status === 'pending'
						}
					});
					Reddcoin.backgnd.updateReddidStatus('preorder', 'process', `transaction received: ${data.response.result}`);
                    priv.userids[index].preordered.tx = data.request.params[0];
                    priv.userids[index].preordered.tx_hash = data.response.result;
                    break;
                case 'register':
                    debug.log("Setting Register data:");
					index = priv.userids.findIndex(function (userid) {
						if(userid.registered !== undefined){
							return userid.registered.status === 'pending'
						}
					});
					Reddcoin.backgnd.updateReddidStatus('register', 'process', `transaction received: ${data.response.result}`);
                    priv.userids[index].registered.tx = data.request.params[0];
                    priv.userids[index].registered.tx_hash = data.response.result;
                    break;
                case 'update':
                    debug.log("Setting update data:");
					index = priv.userids.findIndex(function (userid) {
						if(userid.updated !== undefined){
							return userid.updated.status === 'pending'
						}
					});
					Reddcoin.backgnd.updateReddidStatus('update', 'process', `transaction received: ${data.response.result}`);
                    priv.userids[index].updated.tx = data.request.params[0];
                    priv.userids[index].updated.tx_hash = data.response.result;
                    break;
            }
		}

		// If tx data missing raise an error on the UI
		if (data.response.result === "") {
			var popupWindow = browser.extension.getViews()[1];

			if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.popup){
	            popupWindow.Reddcoin.popup.updateRegister(data);
	        }
		}
	};

	priv.getreddIdTx = function(operation) {
		switch (operation) {
			case 'preorder':
				data = priv.user.preordered;
				break;
			case 'register':
				data = priv.user.registered;
				break;
			case 'update':
				data = data = priv.user.updated;
				break;
		}
		return data
	};

    priv.updateInterface = function(){
			var popupWindow = browser.extension.getViews()[1];

			if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.popup){
            popupWindow.Reddcoin.popup.updateRegister({
                user : priv.user
            });
        }
    };

	priv.getTransactionHeight = function (txHash, acctTransactions) {
		var txHeight = 0

		for (var account in acctTransactions) {
			if (txHash in acctTransactions[account]) {
				txHeight = acctTransactions[account][txHash]
				return txHeight
			}
		}
		return txHeight
	}

	priv.startUser = function (){
		// Monitor user state here
		var user = priv.user

		if (user.uid === "") {
			//no registrations started
			debug.log("No user registration in progress, returning")
			return
		}

		if (user.preordered.status !== true || user.registered.status !== true || user.updated.status !== true || user.confirmed.name === undefined ) {
			debug.log("Continue Registration Status")

			var startOrdering = window.setInterval(function() {

				var acctTransactions = Reddcoin.wallet.getTransactionHeights()

				if (user.preordered.status ==='pending') {
					var preOrderHeight = priv.getTransactionHeight(user.preordered.tx_hash, acctTransactions)
					if (preOrderHeight == 0) {
						debug.log("preorder transaction not confirmed yet: " + preOrderHeight)
					} else {
						debug.log("preorder transaction found at block: " + preOrderHeight)
						user.preordered.status = true;
						user.preordered.height = preOrderHeight
						priv.saveUser()
					}
				}

				if (user.registered.status ==='pending') {
					var registerHeight = priv.getTransactionHeight(user.registered.tx_hash, acctTransactions)
					if (registerHeight == 0) {
						debug.log("register transaction not confirmed yet: " + registerHeight)
					} else {
						debug.log("register transaction found at block: " + registerHeight)
						user.registered.status = true
						user.registered.height = registerHeight
						priv.saveUser()
					}
				}

				if (user.updated.status === 'pending') {
					var updateHeight = priv.getTransactionHeight(user.updated.tx_hash, acctTransactions)
					if (updateHeight == 0) {
						debug.log("update transaction not confirmed yet: " + updateHeight)
					} else {
						debug.log("update transaction found at block: " + updateHeight)
						//user.updated.status = true
						user.updated.height = updateHeight
						priv.saveUser()

						var index = priv.userids.findIndex(function (userid) {return userid.uid === priv.user.uid})

						priv.processUpdateProfile(priv.userids[index].profile, priv.user.uid)
					}
				}

				if (user.registered.status === true && priv.userids.findIndex(function (userid) {return userid.uid === priv.user.uid}) == -1) {

					pub.lookup(user.uid)

				}



				priv.updateInterface();

				debug.info("Continue to check pending status")
			}, 20000); // retry every 20 sec
			debug.info("Continue to check status")
		}
		debug.info("Continue to check lookup status")
	};

    priv.loadUser = function (userObject) {
        debug.log("Loading User: ");
        debug.log(JSON.parse(userObject));
        priv.user = JSON.parse(userObject);
    };

    priv.loadUsers = function (useridsObject) {
        debug.log("Loading Users: ");
        debug.log(JSON.parse(useridsObject));
        priv.userids = JSON.parse(useridsObject);
    };
    priv.fixProfiles = function () {
    	let isDirty = false;
    	priv.userids.forEach(userid => {
			if (userid.profile === undefined) { //no profile, time to add it
				isDirty = true
				debug.log(`${userid.uid} missing a profile, adding an empty one`);
				userid.profile = priv.profileTemplate;
			}
		});
		if (isDirty) {
			priv.saveUser()
		}
	};

// public
	pub.reset = function() {
	    localStorage.removeItem("reddcoinWallet");
	    localStorage.removeItem(priv.userStorageKey);
	    localStorage.removeItem(priv.useridsStorageKey);

		priv = defaults;
	};

	pub.createUser = function(update) {
		update = update || false;

		debug.log("Load UserID");
		let userObject = localStorage.getItem(priv.userStorageKey);
		let useridsObject = localStorage.getItem(priv.useridsStorageKey);
		let walletObject = localStorage.getItem("reddcoinWallet");
		if (walletObject === null){
			debug.log("No Wallet available... continue");
			return;
		}

		if(userObject !== null){
			priv.loadUser(userObject);
		}

		if(useridsObject !== null){
			priv.loadUsers(useridsObject);
			priv.fixProfiles();
		}

		if(update) {
			pub.getNamesOwnedByAddress()
				.then( response => {
					debug.info(`Name ownedBy - send URL: ${JSON.stringify(response)}`);
					return response
				})
				.then( response => {
					if (response.names.length > 0) {
						return pub.getUsers(response.names);
					} else {
						debug.info(`No names owned by address`);
					}
				})
				.then ( response => {

				})
				.catch(error => {
					console.log(error)
				});
		}
		return {error : false};
	};

	pub.setReddidcost = function (data) {
		if (data.satoshis) {
			priv.user.satoshis = data.satoshis;
			priv.user.uid = data.uid;
		} else {
			priv.user.uid = data.uid;
			priv.user.status = data.status;
			priv.user.error = data.error;
		};

	};
	/*
	Return the address and publickey required for preording and registering
	Used for creating transactions for preordering/registering/updating reddid
	 */
	pub.getOrderingDetails = function(owner = false) {
		data = {
			publicKey: priv.getPublicKey(owner),
			owningAddr: priv.getOwningAddress()
		};
		return data

	};
	pub.getReddidcost = function () {
		return priv.user.satoshis;
	};
	pub.getReddid = function () {
		return priv.user.uid;
	};
	pub.getReddidstatus = function () {
		return priv.user.status;
	};
	pub.orderId = function(data){
		priv.orderId(data);
	};
	pub.registerId = function(data){
		priv.registerId(data);
	};
  pub.process_preorder = function (data) {
    debug.log("Processing Preorder " + JSON.stringify(data));

    if ('error' in data) {
      priv.user.error = data.error;
      priv.updateInterface();
      return;
    } else {
      // Store result locally
      let userid = {};
      userid.uid = data.uid;
      userid.profile = priv.profileTemplate;
      userid.preordered = {
        status: 'pending',
        data: data.tx_data
      };

      let index = priv.userids.findIndex(function (userid) {
        return userid.uid === data.uid
      });
      if (index < 0) {
        // user has not been preordered
        priv.userids.push(userid)
      } else {
        // user already preordered.. overwrite
        priv.userids[index] = userid
      }
    }
    priv.saveUser();
    Reddcoin.backgnd.updateReddidStatus('preorder', 'process', 'sending transaction');
    let highfees = true;
    let reddidTx = "preorder";
    Reddcoin.wallet.sendreddID(data.tx_data.inputs, data.tx_data.outputs, true, data.password, reddidTx, highfees) //TODO introduce password

    return pub.getTxStatus(reddidTx, data)
      .catch(error => {
        console.log(error);
        return error
      });
  };
  pub.process_register = function (data) {
    debug.log("Processing Register " + JSON.stringify(data));

    if ('error' in data) {
      priv.user.error = data.error;
      priv.updateInterface();
      throw new Error(data);
    } else {
      // Store result locally
      let registered = {
        status: 'pending',
        data: data.tx_data
      };
      let index = priv.userids.findIndex(function (userid) {
        return userid.uid === data.uid
      });
      if (index < 0) {
        // User should have been preorder and so should have an index
        return false;
      } else {
        priv.userids[index].registered = registered;
      }
    }
    priv.saveUser();
    Reddcoin.backgnd.updateReddidStatus('register', 'process', 'sending transaction');
    let highfees = false;
    let reddidTx = "register";
    Reddcoin.wallet.sendreddID(data.tx_data.inputs, data.tx_data.outputs, true, data.password, reddidTx, highfees) //TODO introduce password

    return pub.getTxStatus(reddidTx, data)
      .catch(error => {
        console.log(error);
        return error
      });
  };
	priv.lookup = function(data) {
		socket.emit('lookup', {user: data});
	}
	pub.lookup = function(data) {
		priv.lookup(data)
	};
	pub.process_lookup = function(data) {
		debug.log("Processing Lookup " + JSON.stringify(data));
		data = JSON.parse(data)

		if (!data.name) {
			return
		}

		var userid = {}
		userid.uid = data.name.substring(0, data.name.indexOf("."))
		userid.confirmed = data

		if (!priv.userids.find(function (userid) {return userid.uid === data.name.substring(0, data.name.indexOf("."))})) {
			priv.userids.push(userid)
		}

		pub.getProfiles();
		priv.saveUser();
		priv.updateInterface()
	};
	pub.process_update = function(data) {
		debug.log("Processing Update " + JSON.stringify(data));

		if (data.error) {
			priv.user.error = data.error;
			priv.updateInterface();
			return;
		} else if (data.status === true) {
			// Store result locally
			let index = priv.userids.findIndex(function (userid) {
				return userid.uid === data.uid
			});

			priv.userids[index].updated = {
				status: data.status,
				value_hash: data.value_hash
			};
			priv.updateInterface();
			return;
		}else {
			// Store result locally
			let index = priv.userids.findIndex(function (userid) {
				return userid.uid === data.uid
			});

			priv.userids[index].updated = {
				status: "pending",
				data: data
			};
		}
		priv.saveUser();
		Reddcoin.backgnd.updateReddidStatus('update', 'process', 'sending transaction');
		var highfees = false;
		var reddidTx = "update";
		Reddcoin.wallet.sendreddID(data.tx_data.inputs, data.tx_data.outputs, true, data.password, reddidTx, highfees) //TODO introduce password

		return pub.getTxStatus(reddidTx, data)
			.catch(error => {
				console.log(error);
				return error
			});
	};
	pub.process_getNamesOwnedByAddress = function(data) {
		debug.log("Processing getNamesOwnedByAddress " + JSON.stringify(data));
		var names = data.names;

		for (name in names) {
			debug.log(names[name])
			uid = names[name].substring(0, names[name].indexOf("."))
			pub.lookup(uid)
		}



	};
	pub.getreddIdTx = function(operation) {
		return priv.getreddIdTx(operation)
	};
	pub.setreddIdTx = function(data) {
		priv.setreddIdTx(data);
		priv.saveUser();
	};
	priv.resetUpdated = function() {
		priv.user.updated = {
				status: false,
				tx: '',
				tx_hash: '',
				value_hash: '',
				height: 0,
				data: ''
				}
	};

	pub.getNamesOwnedByAddress = function(address) {
		address = address || priv.getOwningAddress();
		return Reddcoin.backgnd.getNamesOwnedByAddress({address: address})
	};

	priv.getProfile = function(data) {
		socket.emit('getProfile', {name: data.name, hash: data.hash});
	};
	pub.process_getProfile = function(data) {
		debug.log(data)
		if (data.error) {
			debug.warn (data.error)
		} else {
			var profile = JSON.parse(data.data)
			var index = priv.userids.findIndex(function (userid) {return userid.uid === data.uid.substring(0, data.uid.indexOf("."))})
			priv.userids[index].profile = profile
			priv.saveUser();
		}
	};
	pub.getUser = function(name) {
		let userid = name.slice(0, name.indexOf('.'));
		let namespace = name.slice(name.indexOf('.'));
		return Reddcoin.backgnd.lookup({uid:userid,namespace:namespace})
	};
	pub.getProfile = function(name, hash) {
		let userid = name.slice(0, name.indexOf('.'));
		let namespace = name.slice(name.indexOf('.'));
		return Reddcoin.backgnd.getProfile({uid:userid,namespace:namespace, hash:hash})
	};
	pub.getUserIds = function(){
		var useridList= []
		priv.userids.forEach(function(userid) {
			useridList.push(userid.uid)
		})
		return useridList
	};
	pub.getUserIdData = function(data){

		var index = priv.userids.findIndex(function (userid) {return userid.uid === data.uid})
		return priv.userids[index]
	}
	pub.getUsers = function(data) {
		if (data !== undefined) {
			data.forEach(function(name) {
				let uidOnly = name.substring(0, name.indexOf("."));
				pub.getUser(name)
					.then(response => {
						debug.info(`Get User: ${JSON.stringify(response)}`);
						let userid = {};
						userid.uid = response.name.substring(0, response.name.indexOf("."));
						userid.confirmed = response;
						let index = priv.userids.findIndex(function (userId) {return userId.uid === userid.uid });

						if (index < 0) {
							priv.userids.push(userid)
						} else {
							priv.userids[index] = Object.assign(priv.userids[index], userid)
						}


						priv.saveUser();

						return {name:response.name, value_hash: response.value_hash};
					})
					.then (response => {
						debug.info(`Get Profile: ${JSON.stringify(response)}`);
						if (response.value_hash !== null) {
							let value_hash = response.value_hash;
							pub.getProfile(response.name, response.value_hash)
								.then(prof_response => {
									let profile = prof_response.data;
									let index = priv.userids.findIndex(function (userid) {return userid.confirmed.value_hash === value_hash});
									priv.userids[index].profile = profile;
									priv.saveUser();
								})
								.catch(error => {
									console.log(error)
								});
						} else {
							let profile = priv.profileTemplate;
							let index = priv.userids.findIndex(function (userid) {return userid.uid === uidOnly});
							priv.userids[index].profile = profile;
							priv.saveUser();
						}
					})
					.catch(error => {
						console.log(error)
					});
			});
		}
	};
	/**
	 * Function to save the profile to localstorage
	 * @param data - object {uid, profile}
	 */
  pub.saveSocialProfile = function (data) {

    const profile = data.profile;
    const index = priv.userids.findIndex(function (userid) {
      return userid.uid === data.uid
    });

		priv.userids[index].profile = profile;
		priv.saveUser();
  };
	pub.generateProfile = function (data){

		priv.loadUsers(localStorage.getItem(priv.useridsStorageKey));
		let profile = data.profile;
		let index = priv.userids.findIndex(function (userid) {
			return userid.uid === data.uid
		});

		for (let key in profile) {
			priv.userids[index].profile.networks[key] = profile[key]
		}

		priv.user.uid = data.uid;
		priv.resetUpdated();
		priv.saveUser();

		return priv.userids[index].profile
	};
	pub.checkTransactionArrived = function (operation, confirms) {
		return new Promise(waitForTx);

		function waitForTx( resolve, reject){
			let index = priv.userids.findIndex(function (userid) {
				return userid.uid === operation.uid
			});

			let user = priv.userids[index];

			let op = '';
			if (operation.operation === 'update') {
				op = operation.operation + 'd';
			} else {
				op = operation.operation + 'ed'
			}

			let status = {
				height: 0
			};

			let currentHeight = Reddcoin.backgnd.getBlockheight().bitcoind_blocks;

			let acctTransactions = Reddcoin.wallet.getTransactionHeights();
			let orderHeight = 0;

			//Find the height of our transaction
			if (user[op].status === 'pending' && user[op].tx_hash === '') {
				orderHeight = 0
			} else if (user[op].status === 'pending' && user[op].tx_hash !== '') {
				orderHeight = priv.getTransactionHeight(user[op].tx_hash, acctTransactions);
			}
			status.height = priv.userids[index][op].height = orderHeight;

			let confirmations;
			if (orderHeight === 0) {
				confirmations = 0
			} else {
				confirmations = currentHeight - orderHeight;
			}

			if (confirmations === 0) {
				debug.log(`${JSON.stringify(operation.operation)} transaction not confirmed yet: ${orderHeight}`)
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'checkingtx', `${JSON.stringify(operation.operation)} transaction not confirmed yet: ${orderHeight}`);
			} else if (confirmations > confirms){
				debug.log(`${JSON.stringify(operation.operation)} transaction has been confirmed: ${orderHeight}`);
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'checkingtx', `${JSON.stringify(operation.operation)} transaction has been confirmed: ${orderHeight}`);
				status.status = priv.userids[index][op].status = true;
				status.tx_hash = user[op].tx_hash;
				priv.saveUser();
			} else {
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'checkingtx', `${JSON.stringify(operation.operation)} transaction: Waiting ${confirmations} of ${confirms} confirmations`);
				debug.log(`${JSON.stringify(operation.operation)} transaction: Waiting ${confirmations} of ${confirms} confirmations`)
			}

			if (confirmations > confirms ){
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'complete', true);
				resolve(status)
			} else
				setTimeout(waitForTx.bind(this, resolve, reject), 10000);
		}
	};

  pub.checkOrder = function (operation) {
		let timerId = window.setInterval( function (){
			let data = pub.getOrderStatus(operation);
			debug.info(`${operation.operation} confirmed at block ${JSON.stringify(data)}`);
			if (data.height > 0) {
				debug.info(`Stopping Timer`);
				clearInterval(timerId);
				//TODO
				// if pop up open, update status here
				priv.updateInterface();
				return data
			}
		},10000);
  };
	/**
	 * Function returns a value of status and height for a give operation
	 * @typedef {Object} operation
	 * @property {string} uid - The uid being checked
	 * @property {string} operation - The operation being checked
	 *
	 * @param {operation} operation
	 * @returns {Promise} Promise object representing {height:, status:} of a transaction
	 *
	 * @example
	 * Reddcoin.reddid.getOrderStatus({uid:'monkeyman0020',operation:'preorder'})
	 *
	 * @returns
	 * {"height":2662123,"status":true}
 	 */
  pub.getOrderStatus = function (operation){
		return new Promise(checkOrderStatus);

		function checkOrderStatus( resolve, reject){
			let index = priv.userids.findIndex(function (userid) {
				return userid.uid === operation.uid
			});

			let user = priv.userids[index];
			let op = '';
			if (operation.operation === 'update') {
				op = operation.operation + 'd';
			} else {
				op = operation.operation + 'ed'
			}

			let status = {
				height: 0
			};

			let acctTransactions = Reddcoin.wallet.getTransactionHeights();
			let orderHeight = 0;

			//Get how many confirmations have been made on the operation transaction
			if (user[op].tx_hash === undefined || user[op].tx_hash === '') {
				orderHeight = 0
			} else if (user[op].tx_hash !== null || user[op].tx_hash !== '') {
				orderHeight = priv.getTransactionHeight(user[op].tx_hash, acctTransactions);
			}
			status.height = priv.userids[index][op].height = orderHeight;

			if (orderHeight === 0) {
				debug.log(`${JSON.stringify(operation.operation)} transaction not confirmed yet: ${orderHeight}`)
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'checkingtx', `${JSON.stringify(operation.operation)} transaction not confirmed yet: ${orderHeight}`);
			} else if (orderHeight > 0){
				debug.log(`${JSON.stringify(operation.operation)} transaction has been confirmed: ${orderHeight}`);
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'checkingtx', `${JSON.stringify(operation.operation)} transaction has been confirmed: ${orderHeight}`);
				status.status = priv.userids[index][op].status = true;
				priv.saveUser();
			} else {
				debug.log(`${operation} transaction: Something gone wrong`)
			}


			if (status.status === true ){
				Reddcoin.backgnd.updateReddidStatus(operation.operation, 'complete', true);
				resolve(status)
			} else {
				setTimeout(checkOrderStatus.bind(this, resolve, reject), 10000);
			}
		}
	};
  /**
   * Function to check for the arrival of the tx_hash
   * @param operation - string
   * @param data - object
   * @param timeout - seconds
   * @returns {Promise<any>}
   */
  pub.getTxStatus = function (operation, data, timeout = 60) {
    let start = Date.now();
    return new Promise(checkTxStatus);

    function checkTxStatus(resolve, reject) {
      debug.log(`Checking for ${operation} tx_hash | ${Date.now() - start} secs`);
      Reddcoin.backgnd.updateReddidStatus(operation, 'await_tx', `${(Date.now() - start) / 1000}s`);
      let index = priv.userids.findIndex(function (userid) {
        return userid.uid === data.uid
      });

      let user = priv.userids[index];
      let op = '';
      if (operation === 'update') {
        op = operation + 'd';
      } else {
        op = operation + 'ed'
      }

      if (user[op].tx_hash && user[op].tx_hash !== '') {
        let result = {tx_hash: user[op].tx_hash};
        Reddcoin.backgnd.updateReddidStatus(operation, 'tx', `${user[op].tx_hash}`);
        resolve(result)
      } else if (Date.now() - start >= timeout * 1000) {
        Reddcoin.backgnd.updateReddidStatus(operation, 'tx', `tx monitor timeout ${(Date.now() - start) / 1000}s`);
        reject(new Error('tx monitor timeout'))
      } else {
        setTimeout(checkTxStatus.bind(this, resolve, reject), 500);
      }
    }
  };
  pub.setEmptyProfile = function(data){
	  let index = priv.userids.findIndex(function (userid) {
		  return userid.uid === data.uid
	  });

	  if (index > -1) {
		  let user = priv.userids[index];
		  user.profile = priv.profileTemplate; // blank profile
		  priv.saveUser();
		  return `${data.uid} - empty profile set`
	  } else {
		return `${data.uid} - not found`
	  }
  };
  /**
   * Function to get the currently stored user
   * @param uid
   * @returns {*}
   */
  pub.getLocalUser = function (uid) {
    let index = priv.userids.findIndex(function (userid) {
      return userid.uid === uid
    });

    if (index < 0) {
      debug.log (`${uid} not found`)
    } else {
      debug.log (`${uid} found. ${JSON.stringify(priv.userids[index])}`);
      return priv.userids[index]
    }
  };
  /**
   * Function to update values in the currently stored user
   * @param uid - the userid
   * @param operation - the operation ['preordered','registered']
   * @param key - key to modify
   * @param value - value to set
   * @returns {*}
   */
  pub.updateLocalUser = function (uid, operation, key, value ) {
    let index = priv.userids.findIndex(function (userid) {
      return userid.uid === uid
    });

    if (index < 0) {
      debug.log (`${uid} not found`)
    } else {
      debug.log (`${uid} found, updating`);
      priv.userids[index][operation][key] = value;
      priv.saveUser();
      return priv.userids[index]
    }
  };
  /**
   * Function to remove a currently stored user
   * @param uid
   */
  pub.removeLocalUser = function (uid) {
    let index = priv.userids.findIndex(function (userid) {
      return userid.uid === uid
    });

    if (index < 0) {
      debug.log (`${uid} not found`)
    } else {
      debug.log (`${uid} found, removing`);
      priv.userids.splice(index,1);
      priv.saveUser()
    }
  };

  let update = true;
  pub.createUser(update);

	Reddcoin.reddId = pub;
})(Reddcoin);
