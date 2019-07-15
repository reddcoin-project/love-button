/*************************************************
* Wallet
* Setup initial state and extension settings
*************************************************/

debug.log(`Initializing Extension ${browser.runtime.getManifest().version}`)

// Websocket Server configuration
const SERVER_HOST = 'wss://api.reddcoin.com';
let SERVER_PORT = 443;
let namespace = '/websocket/';
let startPing;

debug.info(`Connecting to server ${SERVER_HOST}:${SERVER_PORT}.`);
let socket = new ReconnectingWebSocket(SERVER_HOST + ':' + SERVER_PORT + namespace );

socket.onopen = function() {
	let msg = `Connected to server: ${SERVER_HOST}:${SERVER_PORT}. ${(socket.readyState = 1) ? true : false }`;

	startPing = Date.now();
	debug.info(msg);
	Reddcoin.backgnd.connectionState(msg);
	let manifestData = browser.runtime.getManifest();
	let payload = {
		'type': 'version',
		'payload': {
			'version': manifestData.version
		}
	};
	socket.send(JSON.stringify({'type': 'ping', 'payload': startPing}));
	socket.send(JSON.stringify(payload))
};


const interval = setInterval(() => {
	debug.log(`send ping`);
	startPing = Date.now();

	if (socket.readyState === ReconnectingWebSocket.OPEN) {
		socket.send(JSON.stringify({'type': 'ping', 'payload': startPing}));
	}
}, 60000);

socket.onclose = function(e) {
	let msg = `Connection Closed code:${e.code}, reason:${e.reason}`;
	debug.log(msg);
	Reddcoin.backgnd.connectionState(msg);
	switch (e.code) {
		case 1000: // CLOSE_NORMAL
			debug.info(`Websocket: Closed Normally`);
			break;
		case 1001: // GOING AWAY
			debug.info(`Websocket: Going Away`);
			break;
		case 1002: // PROTOCOL ERORR
			debug.info(`Websocket: Protocol Error`);
			break;
		case 1003: // UNSUPPORTED DATA
			debug.info(`Websocket: Unsupported Data`);
			break;
		case 1007: // INVALID FRAME PAYLOAD DATA
			debug.info(`Websocket: Invalid Frame Payload Data`);
			break;
		case 1008: // POLICY VIOLATION
			debug.info(`Websocket: Policy Violation`);
			break;
		case 1009: // MESSAGE TOO BIG
			debug.info(`Websocket: Message Too Big`);
			break;
		case 1010: // MISSING EXTENSION
			debug.info(`Websocket: Missing Extension`);
			break;
		case 1011: // INTERNAL ERROR
			debug.info(`Websocket: Internal Error`);
			break;
		case 1012: // SERVER RESTART
			debug.info(`Websocket: Server Restart`);
			break;
		case 1013: // TRY AGAIN LATER
			debug.info(`Websocket: Try Again Later`);
			break;
		case 1014: // BAD GATEWAY
			debug.info(`Websocket: Bad Gateway`);
			break;
		case 1015: // TLS HANDSHAKE
			debug.info(`Websocket: TLS Handshake`);
			break;
		default:
	}
};

socket.onmessage = function(msg) {
	try {
		msg = JSON.parse(msg.data)
	} catch (e) {
		return
	}

	switch (msg.type) {
		case 'pong':
			let endPong = Date.now();
			let time = endPong - msg.payload;
			var msg_ = `Ping time: ${time} ms. ${SERVER_HOST}:${SERVER_PORT}`
			debug.info(msg_);
			Reddcoin.backgnd.pingState(time);
			break;
		case 'date':
			debug.info(JSON.stringify(msg.payload))
			break;
		case 'connections':
			debug.info(JSON.stringify(msg.payload))
			Reddcoin.backgnd.setConnectionInfo(msg.payload);
			break;
		case 'network':
			debug.info(JSON.stringify(msg.payload));
			Reddcoin.backgnd.process_network(msg.payload);
			break;
		case 'tipurl':
			debug.info(JSON.stringify(msg.payload));
			Reddcoin.backgnd.process_tipurl(msg.payload);
			break;
		case 'version':
			debug.info(JSON.stringify(msg.payload));
			Reddcoin.backgnd.checkVersion(msg.payload);
			break;
		default:
			debug.info(JSON.stringify(msg))
	}
};

socket.onerror = function(error) {
	let msg = `Socket encountered error with: ${SERVER_HOST}:${SERVER_PORT} ${error.message}.`;
	Reddcoin.backgnd.connectionState(msg);
	debug.info(msg);
};


Reddcoin.backgnd = (function () {
	var priv = {
		settingsStorageKey : 'reddcoinSettings',
		settingsStatusKey: 'reddidStatus',
		reddidStatus: {
			preorder:{},
			register:{},
			update:{}
		},
		orderDetails: {},
		uid : '',
		connectionState : '',
		clientRelease : '',
		cost : 0,
		message : '',
		blockheight : 0,
		ping : 0,
		ping_pong_times: [],
		monitor: false,
		serverStatus: {
			bitcoind_blocks : 0,
			last_block : 0,
			indexing : true
		},
		connections: {
			max_users : 0,
			online_users : 0
		},
    	socialNetworkSnapshot: {},
		url: 'https://api.reddcoin.com/api/v1/'
},
		pub = {};

/*Private*/
  priv.fetchDataRetry = function (url, path, delay=10000, limit=3, fetchOptions = {}) {
    return new Promise((resolve, reject) => {

      function success(response) {
        if ('error' in response) {
          throw (response)
        } else {
          resolve(response);
        }
      }

      function failure(error) {
        limit--;
        if (limit) {
          console.log(`retrying...${limit}. Error ${JSON.stringify(error)}`);
          setTimeout(fetchUrl, delay);
        } else {
          // this time it failed for real
          reject(error);
        }
      }

      function finalHandler(finalError) {
        throw finalError;
      }

      function fetchUrl() {
        return fetch(url + path, fetchOptions).
        then(response => response.json()).
        then(success).
        catch(failure).
        catch(finalHandler);
      }

      fetchUrl();
    });
  };

  priv.postDataRetry = function (url, path, body, delay=10000, limit=3) {
    let postOptions = {
      method: 'POST',
      headers : new Headers(),
      body: JSON.stringify(body)
    };

    return new Promise((resolve, reject) => {

      function success(response) {
        if ('error' in response) {
          throw (response)
        } else {
          resolve(response);
        }
      }

      function failure(error) {
        limit--;
        if (limit) {
          console.log(`retrying...${limit}. Error ${JSON.stringify(error)}`);
          setTimeout(fetchUrl, delay);
        } else {
          // this time it failed for real
          reject(error);
        }
      }

      function finalHandler(finalError) {
        throw finalError;
      }

      function fetchUrl() {
        return fetch(url + path, postOptions).
        then(response => response.json()).
        then(success).
        catch(failure).
        catch(finalHandler);
      }

      fetchUrl();
    });
  };

	priv.fetchData = function (url, path) {
		return fetch (url+path)
			.then (response => response.json())
			.then (data => {
				console.log(data);
				if ('error' in data) {
					throw new Error(JSON.stringify(data));
				};
				return data;
			})
			.catch(error => {
				console.log(error);
                return error
			})
	};
	priv.postData = function (url, path, body)  {
		return fetch (url+path, {
			method: 'POST',
			headers : new Headers(),
			body: JSON.stringify(body)
			})
			.then (response => response.json())
			.then (data => {
				console.log(data);
				if ('error' in data) {
					throw new Error(JSON.stringify(data));
				};
				return data;
			})
			.catch(error => {
				console.log(error);
                return error
			})
	};
	priv.updateInterface = function(funct, data){
		var popupWindow = browser.extension.getViews()[1];

		if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.popup){
			popupWindow.Reddcoin.popup[funct](data);
		}
	};


/*Public*/

	pub.setInfo = function(blockchain, connections) {
		priv.serverStatus = blockchain
		priv.connections = connections
	};
	pub.setConnectionInfo = function( connections) {
		priv.connections = connections
	};
	pub.setServerInfo = function( blockchain) {
		//blockchain = JSON.parse(blockchain)
		if (blockchain) {
			if ('last_block' in blockchain) {
				priv.serverStatus = blockchain
			} else {
				debug.log(`Server Status: ${blockchain.error}`)
			}
		} else {
			debug.log(`Server Status: No Response`)
		}
	};
	/*
	Function to return the price of an Id
	api/v1/name/cost?userid=<nameid.namespace>
	 */
	pub.getCost = function (data) {
		debug.info("Passed into background Cost: " + JSON.stringify(data));
		return priv.fetchDataRetry(priv.url,`name/cost?userid=${data.uid}${data.namespace}`)
			.then( data => {
				debug.info(`Name Cost: ${JSON.stringify(data)}`);
				return data
			})
      .catch(error => {
        console.log(error);
        return error;
      });

	};
	pub.setCost = function(data) {
		priv.cost = data.cost;
		var popupWindow = browser.extension.getViews()[1];

		if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.popup){
			popupWindow.Reddcoin.popup.updateRegister(data);
		}
	};
	/*
	Function returns the reddid server status
	*/
	pub.getStatus = function() {
		return priv.fetchDataRetry(priv.url,'status')
			.then( data => {
				debug.info(`Returning Status: ${JSON.stringify(data)}`);
				pub.setServerInfo(data);
				return data;
			})
			.catch(error => {
				console.log(error);
				return error
			});
	};
	/**
	 * Function to initiate and chain the reddid order process
	 * @param data
	 * @returns {Promise<T | never> | *}
	 */
	pub.order = function(data) {
		return pub.orderId(data)
			.then( data => {
				return pub.registerId(data)
			})
			.then (data => {
				priv.orderDetails = {};
				return true
			})
			.catch(error => {
				console.log(error);
				return error
			})
	};
	/*
	Function to preorder the reddiId
	api/v1/name/preorder?userid=<nameid.namespace>&publickey=<publickey>&owningaddr=<owningaddr>
	 */
	pub.orderId = function (data) {
		let password = data.password;
		let uid = data.uid;
		let namespace = data.namespace;

		priv.orderDetails = {
			password: data.password,
			uid: data.uid,
			namespace: namespace
		};
		pub.resetReddidStatus();
		pub.updateReddidStatus('preorder', 'init', true);
		debug.info("Passed into background preorderId: " + JSON.stringify(data));
		let orderDetails = Reddcoin.reddId.getOrderingDetails();
		return priv.fetchDataRetry(priv.url,`name/preorder?userid=${uid}${namespace}&publickey=${orderDetails.publicKey}&owningaddr=${orderDetails.owningAddr}`, 3)
			.then( data => {
				if (data === undefined) {
					pub.updateReddidStatus('preorder', 'comms', 'Error - No data');
					throw new Error(`No Data`);
				}
				pub.updateReddidStatus('preorder', 'comms', 'Contact server');
				debug.info(`Name Preorder: ${JSON.stringify(data)}`);
				return data
			})
			.then ( data => {
				data['password'] = password;
				data['uid'] = uid;
				data['namespace'] = namespace;
				pub.updateReddidStatus('preorder', 'process', true);
				return Reddcoin.reddId.process_preorder(data)
			})
			.then (data => {
				debug.log(`Tx result ${data}`);
				return pub.checkOrder({operation:"preorder", uid:uid})
			})
			.catch(error => {
				console.log(error)
				return error
			});
	};
	/*
	Function to return the tx details to get an Id
	api/v1/name/register?userid=<nameid.namespace>&publickey=<publickey>&owningaddr=<owningaddr>
	*/
	pub.registerId = function (data) {
		let password = priv.orderDetails.password;
		let uid = priv.orderDetails.uid;
		let namespace = priv.orderDetails.namespace;
		pub.updateReddidStatus('register', 'init', true);
		debug.info("Passed into background registerId: " + JSON.stringify(data));
		let orderDetails = Reddcoin.reddId.getOrderingDetails();
		return priv.fetchDataRetry(priv.url,`name/register?userid=${uid}${namespace}&publickey=${orderDetails.publicKey}&owningaddr=${orderDetails.owningAddr}`)
			.then( data => {
				if ('error' in data) {
					throw new Error(data);
				}
				pub.updateReddidStatus('register', 'comms', 'Contact server');
				debug.info(`Name Register: ${JSON.stringify(data)}`);
				return data
			})
			.then ( data => {
				data['password'] = password;
				data['uid'] = uid;
				data['namespace'] = namespace;
				pub.updateReddidStatus('register', 'process', true);
				return Reddcoin.reddId.process_register(data)
			})
			.then(data => {
				debug.log(`Tx result ${data}`);
				return pub.checkOrder({operation:"register", uid:uid})
			})
			.catch(error => {
				console.log(error);
				return error
			});
	};
	pub.checkOrder = function(operation){
		pub.updateReddidStatus(operation.operation, 'checkorder', true);
		debug.log(`Background checkOrder: UID: ${operation.uid} - OP: ${operation.operation}`);
		return Reddcoin.reddId.getOrderStatus(operation)
			.then(response => {
				debug.info(`${JSON.stringify(response)}`);
				pub.updateReddidStatus(operation.operation, 'checkorder_result', JSON.stringify(response));
				return response
			}).catch(error => {
				debug.log(`${error}`)
			});
	};
	pub.saveSocialProfile = function(data) {
		if (data.namespace.indexOf('.') > -1){
			data.namespace = data.namespace.slice(data.namespace.indexOf('.') + 1)
		}
		let uid = data.uid;
		let namespace = data.namespace;
		let password = data.password;
		pub.updateReddidStatus('update', 'init', true);
    	debug.log("Background saveSocialProfile"  + JSON.stringify(data));
		let orderDetails = Reddcoin.reddId.getOrderingDetails(owner = true);
		let path = `name/update?userid=${data.uid}.${data.namespace}&publickey=${orderDetails.publicKey}`;
		let profile = data.profile;

		debug.info(`Profile is ${JSON.stringify(profile)}`);

		return priv.postDataRetry(priv.url,path, profile) // First step of updating send name, payload. pubKey
			.then( response => {
				if ('error' in data) {
					throw new Error(data);
				}
				debug.info(`Name Update Step 1 - send URL: ${JSON.stringify(response)}`);
				pub.updateReddidStatus('update', 'comms', 'Contact server');
				return response
			})
			.then( response => {
				debug.info(`Name Update Step 1 - Process response: ${JSON.stringify(response)}`);
				response.uid = uid;
				response.namespace = namespace;
				response.password = password;
				pub.updateReddidStatus('update', 'process', true);
				Reddcoin.reddId.process_update(response);
				debug.info(`Name Update Step 1 - Check if Transaction received: ${JSON.stringify(response)}`);
				pub.updateReddidStatus('update', 'checktx', true);
				return Reddcoin.reddId.checkTransactionArrived({uid:uid, operation:'update'}, 6)
			})
			.then (response => {
				debug.info(`Name Update Step 2 send URL: ${JSON.stringify(response)}`);
				path = `name/update?userid=${uid}.${namespace}&publickey=${orderDetails.publicKey}&tx_hash=${response.tx_hash}`;
				pub.updateReddidStatus('update', 'updateprofile', true);
				return priv.postDataRetry(priv.url, path, profile) // Second step of updating send name, payload. pubKey, tx_hash
			})
			.then( response => { //TODO | this should return value_hash. need to save it away. For the moment just return
				if ('error' in data) {
					throw new Error(data);
				}
				debug.info(`Name Update Step 2 process response: ${JSON.stringify(response)}`);

				Reddcoin.reddId.saveSocialProfile({profile:profile, uid: uid});
				Reddcoin.backgnd.clearSocialNetworkSnapshot();

				return response
			})
			.catch(error => {
				console.log(error)
				return error
			});
    };
	pub.getNamesOwnedByAddress = function(data) {
		debug.log("Background getNamesOwnedByAddress"  + JSON.stringify(data));
		let path = `name/ownedby?address=${data.address}`;
		return priv.postDataRetry(priv.url, path)
			.then( response => {
				debug.info(`Name getNamesOwnedByAddress - send URL: ${JSON.stringify(response)}`);
				return response
			})
			.catch(error => {
				console.log(error)
			});
	};
	pub.lookup = function(data) {
		debug.log("Background lookup"  + JSON.stringify(data));
		if (data.namespace.indexOf('.') > -1){
			data.namespace = data.namespace.slice(data.namespace.indexOf('.') + 1)
		}
		let path = `name/lookup?userid=${data.uid}.${data.namespace}`;
		return priv.fetchDataRetry(priv.url, path)
			.then( response => {
				debug.info(`Name lookup - send URL: ${JSON.stringify(response)}`);
				return response
			})
			.catch(error => {
				console.log(error)
			});
	};
	pub.getProfile = function(data) {
		debug.log("Background profile"  + JSON.stringify(data));
		let path = `name/profile?userid=${data.uid}${data.namespace}&hash=${data.hash}`;
		return priv.postDataRetry(priv.url, path)
			.then( response => {
				debug.info(`Name profile - send URL: ${JSON.stringify(response)}`);
				return response
			})
			.catch(error => {
				console.log(error)
			});
	};
	pub.getPing = function () {
		return priv.ping;
	};
	pub.getBlockheight = function () {
		return priv.serverStatus;
	};
	pub.getConnections = function () {
		return priv.connections;
	}
	pub.getWalletData = function () {
		return Reddcoin.wallet.getInterfaceData();
	};
    pub.getWalletTransactions = function () {
        return Reddcoin.wallet.getTransactions();
	};
	pub.checkPassword = function (data) {
		debug.log("Background checkPassword")
		return Reddcoin.wallet.checkPassword(data.password);
	};
	pub.checkTransaction = function (data) {
		return Reddcoin.wallet.checkTransaction(data.amount, data.tipJarEnabled);
	};
	pub.checkSeed = function (data) {
		return Reddcoin.wallet.checkSeed(data.seed);
	};
	pub.getNewSeed = function () {
		return Reddcoin.wallet.getNewSeed();
	};
	pub.seedWallet = function (data) {
		return Reddcoin.wallet.seed(data.seed, data.password, data.savingsAccountType);
	};
	pub.unlockTipJar = function (data) {
		return Reddcoin.wallet.unlockTipJar(data.password);
	};
	pub.lockTipJar = function () {
		return Reddcoin.wallet.lockTipJar();
	};
	pub.sendTransaction = function (data) {
		debug.log("Background sendTransaction")
		return Reddcoin.wallet.send(data.amount, data.account, data.requirePw, data.to, data.password);
	};
	pub.updateContact = function(data){
		debug.log("Background updateContact")
		return Reddcoin.wallet.updateContact(data.address, data.name);
 	};
 	pub.getContacts = function(){
 		debug.log("Background getContact")
 		return Reddcoin.wallet.getContacts()
 	};
	/**
	 * Function to retrieve all names from namespace
	 * @param data - {namespace: "namespace"}
	 * @returns {Promise<T | never>}
	 */
 	pub.getReddidContacts = function(data){
		debug.info("Passed into background getReddidContacts: " + JSON.stringify(data));
		if (data.namespace.indexOf('.') > -1){
			data.namespace = data.namespace.slice(data.namespace.indexOf('.') + 1)
		}

		return priv.fetchDataRetry(priv.url,`namespace/names?namespace=${data.namespace}`)
			.then( data => {
				return data
			})
			.catch(error => {
				console.log(error);
				return error;
			});
 	};
 	pub.getReddidContactAddress = function(data){
 		console.log("Get reddid contact address: " + data)
		//todo socketio
 		socket.emit('getreddidcontactaddress', data);
 	};
 	pub.networks = function(data) {
		console.log("Get network user");
		let payload = {
			"type": "network",
			"payload": data
		};
		socket.send(JSON.stringify(payload));
	};
	pub.tipurlhistory = function(data) {
		console.log("Broadcast Tip URL");
		let payload = {
			"type": "tipurl",
			"payload": data
		};
		socket.send(JSON.stringify(payload))
	};
	pub.sendtip = function(data) {
		console.log("Send tip to user");
        const tx = {
            amount: data.amount * COIN,
            account: '0',
            requirePw: false,
            to: data.address,
            password: ''
        };
        //pub.sendTransaction(tx);

        const urlHistory = {
            network: data.network,
            title: data.title,
            url: data.url,
            value: data.amount
        };
        pub.tipurlhistory(urlHistory);

        browser.notifications.create('tipSent', {
            type : "basic",
            title : "Tip sent",
            message : `Tipped '${data.authorName}' with ${tx.amount} Reddcoins`,
            iconUrl : "assets/icon-ID-48.png"
        });
	};
	pub.saveSocialNetworkSnapshot = data => {
		debug.log("Background saveSocialNetworkSnapshot");
		debug.log(data);
        priv.socialNetworkSnapshot = data.snapshot;
    };
	pub.restoreSocialNetworkSnapshot = () => {
		debug.log("Background restoreSocialNetworkSnapshot");
        return priv.socialNetworkSnapshot;
    };
	pub.clearSocialNetworkSnapshot = () => {
        debug.log("Background clearSocialNetworkSnapshot");
        priv.socialNetworkSnapshot = {};
	};
    pub.getUserIds = function(){
    	return Reddcoin.reddId.getUserIds();
    };
    pub.getUserIdData = function(data){
    	return Reddcoin.reddId.getUserIdData(data);
    };
    pub.createUser = function(update){
    	return Reddcoin.reddId.createUser(update.update);
    };

	pub.logout = function() {
		return Reddcoin.reddId.logout(); 
	};

	/**
	 * Function to publish the connection state to the popup if open
	 * @param state
	 */
	pub.connectionState = function (state) {
    	priv.connectionState = state;
		var popupWindow = browser.extension.getViews()[1];

        if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.viewWalletStatus){
            popupWindow.Reddcoin.viewWalletStatus.getView({
                connection : priv.connectionState
            });
        }
    };
	/**
	 * Function to return the connection state of the websocket service
	 * @returns {string}
	 */
	pub.getconnectionState = function () {
    	return {connection: priv.connectionState}
		};
    pub.pingState = function (time) {
		var sum = 0;
		priv.ping_pong_times.push(time);
		if (priv.ping_pong_times.length > 30) {
			priv.ping_pong_times = priv.ping_pong_times.slice(-30); // keep last 30 samples
		}

		for (var i = 0; i < priv.ping_pong_times.length; i++)
		sum += priv.ping_pong_times[i];
		var ping_avg_30 = Math.round(10 * sum / priv.ping_pong_times.length) / 10

		sum = 0
		var samples = (priv.ping_pong_times.length > 10) ? 10 : priv.ping_pong_times.length
		for (var i = 0; i < samples; i++)
		sum += priv.ping_pong_times[i];
		var ping_avg_10 = Math.round(10 * sum / samples) / 10

			var popupWindow = browser.extension.getViews()[1];

			if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.viewWalletStatus){
            popupWindow.Reddcoin.viewWalletStatus.getView({
                ping : {
                	ping: time,
                	ping_avg_10: ping_avg_10,
                	ping_avg_30: ping_avg_30
                }
            });
        }
    };
    pub.checkVersion = function(data) {
    	priv.clientRelease = data.release;
			var popupWindow = browser.extension.getViews()[1];

			if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.viewWalletStatus){
            popupWindow.Reddcoin.viewWalletStatus.getView({
                version : priv.clientRelease
            });
        }

    };
    pub.getReleaseVersion = function(){
    	return {version:priv.clientRelease};
		};
	/**
	 * Function to process the response message for network name lookups
	 * and return to the designated page (popup or content)
	 *
	 * @param {string} data
	 *
	 * @example
	 *
	 * pub.process_network({})
	 * {"username":"example","fingerprint":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","proofURL":"https://www.reddit.com/r/verifyreddid/comments/9ahlsd/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca5/","address":"RatabZVDd4sdEPFWrt1asdPvLnVyTJi000","valid":true,"source":"cp"}
	 *
     */
	pub.process_network = function(data) {
		console.log("Processing Network " + JSON.stringify(data));
		if (data.source === 'cp') {
			// Send back to content page
			const querying = browser.tabs.query({active: true, currentWindow: true});
			querying
				.then(tabs => {
					if (tabs.length > 0 ) {
						browser.tabs.sendMessage(tabs[0].id, {cp_response: data, "type":"network"})
					}
				})
				.catch(error => {
					console.log(error)
				});
		} else if (data.source === 'pu') {
			// Send back to popup page
			var popupWindow = browser.extension.getViews()[1];

			if(popupWindow && popupWindow.Reddcoin && popupWindow.Reddcoin.viewSocialNetworks){
				popupWindow.Reddcoin.viewSocialNetworks.processNetwork(data);
			}
		} else {
			debug.log('Cannot process network message');
		}
	};
	/*
	Process the tip URL and store it locally
	 */
	pub.process_tipurl = function(data) {
		console.log("Processing Tip URL " + JSON.stringify(data));
		if (localStorage.tip_links === undefined) {
			tip_links = [];
		}else {
			tip_links = JSON.parse(localStorage.tip_links);
		}

		tip_links.push(data);
		tip_links = tip_links.slice(-50); // keep 50 most recent
		localStorage.setItem("tip_links", JSON.stringify(tip_links));
		//send_message('tip_link',data)
	};
	/*
	Poll the server periodically to get the current chain state
	 */
    pub.updateStatus = function () {
		window.setInterval(function() {
			pub.getStatus(function(data){
				debug.info(`Update Status ${data}`)
				pub.setServerInfo(data)
			})
		},
		10000);
	};

	pub.initExtension = function (){
		let manifestData = browser.runtime.getManifest();
		let extVersion = manifestData.name;
		if (extVersion.indexOf('beta') > -1) {
			browser.browserAction.setBadgeText({text: 'Beta'});
		} else {
			browser.browserAction.setBadgeText({text: ''});
		}
	};
	priv.getDefaultData = function () {
		return {
			tipJarEnabled: 'true',
			maxBalancePercent: '10',
			maxBalance: '5000',
			hidePromptThreshold: '500'
		}
	};
	pub.setSettings = function (data) {
		localStorage.setItem(priv.settingsStorageKey, JSON.stringify(data.settings))
	};
	pub.getSettings = function () {
		let	data = localStorage.getItem(priv.settingsStorageKey);

		if (data === null) {
			data = priv.getDefaultData();
		} else {
			data = JSON.parse(data);
		}

		return data;
	};
	priv.getDefaultReddidStatus = function () {
		return priv.reddidStatus
	};
	pub.setReddidStatus = function (data) {
		localStorage.setItem(priv.settingsStatusKey, JSON.stringify(data))
	};
	pub.resetReddidStatus = function () {
		let statusData = priv.getDefaultReddidStatus();
		pub.setReddidStatus(statusData);
	};
	pub.updateReddidStatus = function (operation, statusKey, statusValue) {
		let status = pub.getReddidStatus();

		status[operation][statusKey] = statusValue;
		debug.log(`Reddid ops ${operation} | ${statusKey} | ${statusValue}`);
		priv.updateInterface('updateRegister', {registration: status});
		pub.setReddidStatus(status)
	};
	pub.getReddidStatus = function () {
		let statusData = localStorage.getItem(priv.settingsStatusKey);

		if (statusData === null) {
			statusData = priv.getDefaultReddidStatus();
		} else {
			statusData = JSON.parse(statusData);
		}
		return statusData;
	};
	/** Function to get the overall extension state
	 * Query available data and return a result object representing the current application state.
	 * @returns {{}|*}
	 */
	pub.getAppState = function(data){
		return Reddcoin.Appstate.getAppState(data);
	};
	pub.getAddressBalance = function (address) {
		let result = Reddcoin.wallet.getInterfaceData().addresses;
		let index = result.findIndex(addrObj => {
			return addrObj.address === address.address
		});
		return {balance:{confirmed:result[index].confirmed,unconfirmed:result[index].unconfirmed}, address:address.address}
	};
	/*
	Initialise some extension settings
	 */
	pub.initExtension();

    /*
    start background timer
      */
	pub.updateStatus();

	return pub;
})();
