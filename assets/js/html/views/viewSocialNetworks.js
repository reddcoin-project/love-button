/*************************************************
 * View to construct social networks
 * Setup initial state and does interaction with the wizard
 *************************************************/

(function (exports) {
  const priv = {};
  const pub = {};
  
  const networks = [
    {
      name: 'facebook',
      friendlyName: 'Facebook',
      url: 'https://www.facebook.com',
      enabled: true,
      optionalPrefix: '',
      regexUsername: /^[\w\.]{1,50}$/,
      msgUsername: 'Facebook username needs to be alpha-numeric (with optional period "."), 1-50 chars long',
      usernameExplanation: 'Your Facebook username is shown at <a href="https://www.facebook.com/settings">your settings</a>, the part after "https://www.facebook.com/".\nThis username is also visible in the URL when you browse your own timeline',
      proofUrlLanding: 'https://www.facebook.com/%USERNAME%',
      proofUrlRegexpTemplate: '^http(?:s)?:\/\/(?:www\.)?facebook\.com\/%USERNAME%\/posts\/[0-9]+(?:\/)?',
      proofUrlPrefix: 'https://www.facebook.com/%USERNAME%/posts/',
      proofUrlHint: 'Make sure to post the fingerprint in a new update posted on your own timeline at %PROOFURLLANDING%',
    },
    {
      name: 'flickr',
      friendlyName: 'Flickr',
      url: 'https://www.flickr.com',
      enabled: false,
      optionalPrefix: '',
      regexUsername: /^.*$/,
      msgUsername: '',
      usernameExplanation: '',
      proofUrlLanding: '',
      proofUrlRegexpTemplate: '',
      proofUrlPrefix: '',
      proofUrlHint: '',
    },
    {
      name: 'instagram',
      friendlyName: 'Instagram',
      url: 'https://www.instagram.com',
      enabled: false,
      optionalPrefix: '',
      regexUsername: /^.*$/,
      msgUsername: '',
      usernameExplanation: '',
      proofUrlLanding: '',
      proofUrlRegexpTemplate: '',
      proofUrlPrefix: '',
      proofUrlHint: '',
    },
    {
      name: 'reddit',
      friendlyName: 'Reddit',
      url: 'https://www.reddit.com',
      enabled: true,
      optionalPrefix: 'u/',
      regexUsername: /^u?\/?[A-Za-z0-9_-]{1,20}$/,
      msgUsername: 'Reddit username should be 1-20 chars, with an optional starting /u',
      usernameExplanation: 'Your Reddit username is the username you use on <a href="https://reddit.com" target="_blank">reddit</a>, and can be entered with or without the leading "u/"',
      proofUrlLanding: 'https://www.reddit.com/r/verifyreddid/',
      proofUrlRegexpTemplate: '^http(?:s)?:\/\/(?:www\.)?reddit\.com\/r\/verifyreddid\/comments\/[a-z0-9]{6,}\/[a-z0-9]{2,}(?:\/)?',
      proofUrlPrefix: 'https://www.reddit.com/r/verifyreddid/comments/',
      proofUrlHint: 'Make sure to post the fingerprint in the <u>title</u> of a new post at %PROOFURLLANDING%',
    },
    {
      name: 'twitter',
      friendlyName: 'Twitter',
      url: 'https://www.twitter.com',
      enabled: true,
      optionalPrefix: '@',
      regexUsername: /^@?\w{1,15}$/,
      msgUsername: 'Twitter handles should be 1-15 chars long, with an optional starting @',
      usernameExplanation: 'Your Twitter handle (username) is shown at <a href="https://twitter.com/settings/account" target="_blank">your twitter settings</a>, and can be entered with or without a leading "@"',
      proofUrlLanding: 'https://www.twitter.com/%USERNAME%',
      proofUrlRegexpTemplate: '^http(?:s)?:\/\/(?:www\.)?twitter\.com\/%USERNAME%\/status\/[0-9]+(?:\/)?',
      proofUrlPrefix: 'https://www.twitter.com/%USERNAME%/status/',
      proofUrlHint: 'Make sure to post the fingerprint a new tweet posted on your own timeline at %PROOFURLLANDING%',
    },
    {
      name: 'youtube',
      friendlyName: 'YouTube',
      url: 'https://www.youtube.com',
      enabled: true,
      optionalPrefix: '',
      regexUsername: /^UC[A-Za-z0-9-_]+$/,
      msgUsername: 'Youtube handle needs to starts with UC and be alpha-numeric (with optional period "_" & "-"). Please note we only support channels at this point.',
      usernameExplanation: 'Your ID to be used on YouTube is your own "Channel ID", this ID can be retrieved by following the steps <a href="https://support.google.com/youtube/answer/3250431" target="_blank">outlined here</a>, make sure to copy the Channel ID and *not* the User ID!',
      proofUrlLanding: 'https://www.youtube.com/channel/%USERNAME%/about',
      proofUrlRegexpTemplate: 'https://www.youtube.com/channel/%USERNAME%/about',
      proofUrlPrefix: 'https://www.youtube.com/channel/%USERNAME%/about',
      proofUrlHint: 'Please post the fingerprint (via Customize Channel) in the description field on the about page of your channel at %PROOFURLLANDING%',
    },
  ];
  
  function startWizard() {

    // we start with a clean slate, make sure to kill old sessions
    Reddcoin.messenger.clearSocialNetworkSnapshot();
    $('#socialNetworkUsername').val('');
    $('#fingerprint').val('');
    $('#socialNetworkProofURL').val('');
    
    // get user from dropdown
    const selectedUser = $('#getSocialUserId_Select').val();
    if (selectedUser) {
      $('#socialOverview').hide();
      console.log('selected user ' + selectedUser);
      
      Reddcoin.messenger.getUserIdData(selectedUser, data => {
        const registeredNetworkNames = Object.keys(data.profile.networks);
        
        // fill dropdown with possible networks
        const select = $('#reddidSocial_select');
        select.empty();
        select.append('<option value="" selected>Select a network</option>');
        for (network of networks) {
          const disabledNetwork = network.enabled === false;
          const networkAlreadyRegistered = registeredNetworkNames.some(name => name === network.name);
          const disabled = disabledNetwork || networkAlreadyRegistered ? 'disabled="disabled"' : '';
          
          select.append(`<option value="${network.name}" ${disabled}>${network.friendlyName}</option>`);
        }
        
        $('#socialNetworkWizardStep1Btn').prop('disabled', true);
        $('#socialStep1').css('display', 'flex');
      });
    }
  }
  
  
  function toStep2() {
    $('#socialStep1').hide();
    
    Reddcoin.messenger.restoreSocialNetworkSnapshot(function (restoredSnapshot) {
      console.log('restoredSnapshot');
      console.log(restoredSnapshot);
      
      const selectedUser = restoredSnapshot.selectedUser || $('#getSocialUserId_Select').val();
      const selectedNetwork = restoredSnapshot.selectedNetwork || $('#reddidSocial_select').val();
      
      const newSnapshot = Object.assign({selectedUser, selectedNetwork}, restoredSnapshot || {});
      console.log(newSnapshot);
      Reddcoin.messenger.saveSocialNetworkSnapshot({snapshot: newSnapshot});
      
      const usernameExplanation = networks.find(network => network.name === selectedNetwork).usernameExplanation;
      $('#sn_username_explanation').html(usernameExplanation);
    });
    
    $('#socialNetworkWizardStep2Btn').prop('disabled', true);
    $('#socialStep2').css('display', 'flex');
  }
  
  function generateFingerprint(network, uid, username) {
    console.log('generating fingerprint');
    
    const fingerprint = sha256(uid + network + username);
    
    console.log(`generated fingerprint ${fingerprint}`);
    
    return fingerprint;
  }
  
  function toStep3() {
    $('#socialStep2').hide();
    
    Reddcoin.messenger.restoreSocialNetworkSnapshot(function (restoredSnapshot) {
      console.log('restoredSnapshot');
      console.log(restoredSnapshot);
      
      const username = restoredSnapshot.username || getUsernameFromInput(restoredSnapshot.selectedNetwork);
      const fingerprint = restoredSnapshot.fingerPrint || generateFingerprint(restoredSnapshot.selectedNetwork, restoredSnapshot.selectedUser, username);
      $('#fingerprint').val(fingerprint);
      
      const currentNetwork = networks.find(network => network.name === restoredSnapshot.selectedNetwork);
      const proofUrlLanding = currentNetwork.proofUrlLanding.replace('%USERNAME%', username);
      const proofUrlHint = currentNetwork.proofUrlHint.replace('%PROOFURLLANDING%', `<a href="${proofUrlLanding}" target="_blank">${proofUrlLanding}</a>`);
      $('#sn_proofurl_hint').html(proofUrlHint);
      
      const newSnapshot = Object.assign({username, fingerprint}, restoredSnapshot || {});
      console.log(newSnapshot);
      Reddcoin.messenger.saveSocialNetworkSnapshot({snapshot: newSnapshot})
    });
    
    $('#socialNetworkWizardStep3Btn').prop('disabled', true);
    $('#socialStep3').css('display', 'flex');
  }
  
  function finish() {

    // this is an async timeout util (very useful indeed)
    const timeout = async ms => new Promise(res => setTimeout(res, ms));

    let next = false; // this is to be changed on user input
    $('#passwordOkayOverlaySocial').click(function() {
      next = true
    });
    $('#passwordCancelOverlaySocial').click(function() {
      next = false
      $('.reddidPopupPage_PasswordOverlay').hide();
    });

    async function waitUserInput() {
      while (next === false) await timeout(50); // pause script but avoid browser to freeze ;)
      next = false; // reset var
      console.log('user input detected');
    }

    async function orderUp (profileAndUser) {
      $("#passwordErrorOverlaySocial").hide();
      $("#pwLoadingOverlaySocial").hide();
      let val = 0.01;

      let details = await checkTx(val,true);
      if (details.isPossible) {
        debug.log(JSON.stringify(details));
        let msg = "You are about to update your social network. Cost is a network transaction fee (~ 0.01RDD)";
        msg += '<br/>';
        msg += '<br/>';
        $("#passwordMessageOverlay").html(msg).show();
        $(".reddidPopupPage_PasswordOverlay").show();

        await waitUserInput();
        let pwd = $('#passwordOverlaySocial').val();
        $("#pwLoadingOverlaySocial").show();
        let checkPwd = await checkPassword(pwd);
        if (checkPwd) {
          $("#passwordErrorOverlay").hide();
          $("#pwLoadingOverlaySocial").hide();
          $(".reddidPopupPage_PasswordOverlay").hide();
          $('#error_msg_txt').text('');

          console.log(`Saving profile ${JSON.stringify(profileAndUser['profile'])} for user ${profileAndUser[uid]}`);
          profileAndUser['password'] = pwd;

          Reddcoin.messenger.saveSocialProfile(profileAndUser);
          Reddcoin.messenger.clearSocialNetworkSnapshot();

          toFinishedSuccessfully();
        }
        else {
          $("#passwordErrorOverlay").show();
          $(".reddidPopupPage_PasswordOverlay").hide();
          $('#passwordOverlaySocial').val('');
          $('#sn_proofurl_error').text('Password Incorrect')
        }
      }
    }

    function checkTx(value, tipJarEnabled) {
      return new Promise (resolve => {
        Reddcoin.messenger.checkTransaction(value, true, (data) => {
          resolve(data);
        })
      })
    };

    function checkPassword(password) {
      return new Promise ((resolve, reject) => {
        Reddcoin.messenger.checkPassword(password, (data) => {
          resolve(data);
        })
      })
    };

    function orderId(uid, namespace, password) {
      return new Promise ((resolve, reject) => {
        Reddcoin.messenger.order(uid, namespace, password, (data) => {
          resolve(data);
        })
      })
    };


    const wallet = JSON.parse(localStorage.getItem('reddcoinWallet'));
    const userids = JSON.parse(localStorage.getItem('userids'));
    const address = wallet.accounts[0].addresses[2].address; //TODO this must be user-selectable in a future version
    const proofURL = $('#socialNetworkProofURL').val().trim();
    
    Reddcoin.messenger.restoreSocialNetworkSnapshot(function (restoredSnapshot) {
      console.log('restoredSnapshot');
      console.log(restoredSnapshot);
      
      const {selectedNetwork, selectedUser, username, fingerprint} = restoredSnapshot;
      
      const proofurlErrorField = $('#sn_proofurl_error');
      proofurlErrorField.text('');
      
      const network = networks.find(network => network.name === selectedNetwork);
      const {proofUrlPrefix, proofUrlRegexpTemplate} = network;
      const proofUrlRegexp = new RegExp(proofUrlRegexpTemplate.replace('%USERNAME%', username), "g");
      
      if (proofUrlRegexp.test(proofURL)) {
        const user = userids.find(user => user.uid === selectedUser);
        const profile = user.profile;

        profile.networks[selectedNetwork] = {
          username,
          proofURL,
          address,
          fingerprint,
        };

        orderUp({profile, uid: selectedUser, namespace: Reddcoin.popup.getNamespace()});

      } else {
        const proofUrlTemplate = proofUrlPrefix.replace('%USERNAME%', username);
        proofurlErrorField.text(`The URL should start with ${proofUrlTemplate}`);
      }
    });
  }
  
  function toFinishedSuccessfully() {
    resetWindows();
    $('#socialStep4').css('display', 'flex');
  }
  
  function onChangeSocialNetworkSelection() {
    const selectedNetwork = $('#reddidSocial_select').val();
    if (selectedNetwork) {
      console.log('selected network ' + selectedNetwork);
      $('#socialNetworkWizardStep1Btn').prop('disabled', false);
    } else {
      console.log('did not select network');
      $('#socialNetworkWizardStep1Btn').prop('disabled', true);
    }
  }
  
  function continueRegistration() {
    Reddcoin.messenger.restoreSocialNetworkSnapshot(function (restoredSnapshot) {
      console.log('resumimg registration..');
      console.log(restoredSnapshot);
      
      resetWindows();
      
      if (restoredSnapshot['fingerprint']) toStep3();
      else if (restoredSnapshot['username']) toStep3();
      else if (restoredSnapshot['selectedNetwork']) toStep2();
      else startWizard();
    });
  }
  
  function copyFingerprintToClipboard() {
    $('#fingerprint').focus().select();
    
    try {
      const successful = document.execCommand('copy');
      console.log('Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
      
    } catch (err) {
      console.log('Oops, unable to copy ' + err);
      $('#fingerprintCopyFailed').innerText = 'Could not copy to clipboard';
      //TODO add more user friendly handling
    }
  }
  
  function checkUsername() {
    Reddcoin.messenger.restoreSocialNetworkSnapshot(function (restoredSnapshot) {
      console.log('restoredSnapshot');
      console.log(restoredSnapshot);
      
      const selectedNetwork = restoredSnapshot.selectedNetwork || $('#reddidSocial_select').val();
      const username = getUsernameFromInput(selectedNetwork);
      const button = $('#socialNetworkWizardStep2Btn');
      
      const network = networks.find(network => network.name === selectedNetwork);
      const regexValue = network.regexUsername;
      if (!regexValue.test(username)) {
        $('#Step2_msg_txt').text(network.msgUsername)
      } else {
        $('#Step2_msg_txt').text('')
      }
      
      if (username && regexValue.test(username)) {
        button.prop('disabled', false);
      } else {
        button.prop('disabled', true);
      }
    });
  }
  
  function getUsernameFromInput(selectedNetwork) {
    const optionalPrefix = networks.find(network => network.name === selectedNetwork).optionalPrefix;
    const username = $('#socialNetworkUsername').val().trim();
    
    if (username.startsWith(optionalPrefix)) {
      return username.substring(optionalPrefix.length);
    } else {
      return username;
    }
  }
  
  function checkProofUrl() {
    const url = ($('#socialNetworkProofURL').val() || '').trim();
    const button = $('#socialNetworkWizardStep3Btn');
    
    if (url && url.startsWith('http')) {
      button.prop('disabled', false);
    } else {
      button.prop('disabled', true);
    }
  }
  
  priv.fillSocialUserIdSelect = function (currentReddIDuid) {
    Reddcoin.messenger.getUserIds(ids => {
      let html = '<option value="">Select a ReddID name</option>';
      
      ids.forEach(userid => {
        const selected = userid === currentReddIDuid ? 'selected="selected"' : "";
        html += `<option value="${userid}" ${selected}>${userid}</option>`;
      });
      
      $('#getSocialUserId_Select').html(html);
    });
  };
  
  priv.fillRegisteredNetworks = function fillRegisteredNetworks(reddIDuid) {
    $('#social_network_overview_msg').text(`No networks registered yet, click below to start or continue an existing registration`);
    
    const userids = JSON.parse(localStorage.getItem('userids'));
    if (userids) {
      const foundUserIdEntry = userids.find(useridEntry => useridEntry.uid === reddIDuid);
      if(foundUserIdEntry && foundUserIdEntry.confirmed){
        let namespace = foundUserIdEntry.confirmed.name.slice(foundUserIdEntry.confirmed.name.indexOf('.') + 1);
        if (foundUserIdEntry.profile) {
          const {profile: {networks: registeredNetworks = []}} = foundUserIdEntry;
          if (registeredNetworks) {
            const registeredNetworkNames = Object.keys(registeredNetworks);
            if (registeredNetworkNames.length) {
              let snInfo = 'You are connected to the following networks:';
              snInfo += '<table class="sn_info"><tr><th class="sn_info_network">Network</th><th>Username</th><th>Validated</th><th></th></tr>';
              registeredNetworkNames.forEach(networkName => {
                const friendlyNetworkName = networks.find(network => network.name === networkName).friendlyName;
                const {username} = registeredNetworks[networkName];

                Reddcoin.messenger.networks('pu', networkName, username, namespace);

                const cellId = `social_network_validated_${networkName}_${username}_${namespace}`;
                const cellIdReset = `${cellId}_reset`;
                snInfo += `<tr><td>${friendlyNetworkName}</td><td>${username}</td><td id="${cellId}"><i>calculating...</i></td><td id="${cellIdReset}"><span class="fa fa-recycle hidden reset" title="reset" data-uid="${reddIDuid}" data-network="${networkName}" data-namespace="${namespace}"></td></tr>`;
              });

              snInfo += '</table>';
              $('#social_network_overview_msg').html(snInfo);
            }
          }
        }
      }

    }
  };
  
  function onChangeSocialUserIdSelection() {
    const selectedUid = $('#getSocialUserId_Select').val();
    
    if (selectedUid) {
      console.log('selected uid ' + selectedUid);
      $('#socialNetworkWizardStartBtn').prop('disabled', false);
      priv.fillRegisteredNetworks(selectedUid);
    } else {
      console.log('did not select uid');
      $('#socialNetworkWizardStartBtn').prop('disabled', true);
    }
    
  }
  
  $(function () {
    $('#socialNetworkWizardStartBtn').on('click', () => startWizard());
    $('#socialNetworkWizardContinueBtn').on('click', () => continueRegistration());
    $('#socialNetworkWizardStep1Btn').on('click', () => toStep2());
    $('#socialNetworkWizardStep2Btn').on('click', () => toStep3());
    $('#socialNetworkWizardStep3Btn').on('click', () => finish());
    $('#socialNetworkWizardStep4Btn').on('click', () => pub.getView());
    $('#getSocialUserId_Select').on('change', () => onChangeSocialUserIdSelection());
    $('#reddidSocial_select').on('change', () => onChangeSocialNetworkSelection());
    $('#copyFingerprint').on('click', () => copyFingerprintToClipboard());
    $('#socialNetworkUsername').on('keyup', () => checkUsername());
    $('#socialNetworkProofURL').on('keyup', () => checkProofUrl());
    $(document).on('click', '.reset', (e) => resetSocialNetwork(e));
  });
  
  function resetWindows() {
    $('#socialOverview').hide();
    $('#socialStep1').hide();
    $('#socialStep2').hide();
    $('#socialStep3').hide();
    $('#socialStep4').hide();
  }
  
  pub.getView = function () {
    resetWindows();
    $('#reddidPopupSocial').css('display', 'flex');
    
    Reddcoin.messenger.restoreSocialNetworkSnapshot(function (restoredSnapshot) {
      console.log('starting social network menu, checking if there is a snapshot pending');
      console.log(restoredSnapshot);
      if (restoredSnapshot && Object.keys(restoredSnapshot).length > 0) {
        $('#socialNetworkWizardContinueBtn').css('display', 'inline-block');
        $('#socialNetworkWizardStartBtn').css('display', 'inline-block');
      } else {
        $('#socialNetworkWizardContinueBtn').css('display', 'none');
        $('#socialNetworkWizardStartBtn').css('display', 'block');
      }
    });
    
    const userids = localStorage.getItem('userids'); // TODO or get the current/active one from the userid bucket instead?
    if (userids !== null){
      uid = userids[0].uid; //TODO for the moment, lets set the first one. add an active user later
      priv.fillRegisteredNetworks(uid);
    } else {
      uid = 'No User'
    }
    priv.fillSocialUserIdSelect(uid);
  
    $('#social_network_need_coins').text('');
    $('#social_network_reset').text('');
    
    priv.validateCoinAmount();
    pub.getOwningAddrBalance();
    
    $('#socialOverview').css('display', 'flex');
  };
  
  priv.validateCoinAmount = function () {
    Reddcoin.messenger.getWalletData(function (data) {
      const tipJar = data.addresses.find(entry => entry.name === 'Tip Jar');
      if (tipJar) {
        const tipJarAmountRdd = tipJar.confirmed * COIN;
        const minimumRddRequired = 5;
        
        if (tipJarAmountRdd < minimumRddRequired) {
          const msg = `Current amount in the tip jar is ${tipJarAmountRdd} RDD, make sure at least ${minimumRddRequired}
          RDD is present before adding social media networks to your ReddID username`;
          $('#social_network_need_coins').text(msg);
        }
      }
    });
  };
  
  function resetSocialNetwork(e) {
    console.log('Reset called');
    
    const uid = e.target.dataset.uid;
    const network = e.target.dataset.network;
    const namespace = e.target.dataset.namespace;
    
    if (uid && network && namespace) {

      const userids = JSON.parse(localStorage.getItem('userids'));
      if (userids) {
        const foundUserIdEntry = userids.find(useridEntry => useridEntry.uid === uid);
        if(foundUserIdEntry){
          if (foundUserIdEntry.profile) {

            $('#social_network_reset').text(`Performing reset for '${network}'. This happens in the background, so be sure to check again later.`);

            let profile = foundUserIdEntry.profile;
            delete profile.networks[network];

            Reddcoin.messenger.saveSocialProfile({profile: profile, uid, namespace});
            console.log(`Saved profile ${JSON.stringify(profile)} for user ${uid}.${namespace}`);
          }
        }
      }
    }
  }
  
  pub.processNetwork = function (data) {
    console.log(data);
    const {network, username, valid, namespace} = data;
    
    let validated = '';
    if (valid === true) {
      validated = 'yes';
    } else if (valid === false) {
      validated = 'no';
    } else {
      validated = 'unknown';
    }
    
    const cellId = `social_network_validated_${network}_${username}_${namespace}`;
    console.log(`Setting validated=${validated} on cell ${cellId}`);
    $(`td[id="${cellId}"]`).text(validated);
  
    if (validated === 'no' || validated === 'unknown') {
      const cellIdReset = `${cellId}_reset`;
      const reset = $(`td[id="${cellIdReset}"]`).children('span');

      if ($('#social_network_need_coins').text()) {
        reset.hide();
      } else {
        reset.show();
      }
    }
  };

  pub.getOwningAddrBalance = function () {

    const wallet = JSON.parse(localStorage.getItem('reddcoinWallet'));
    if (!wallet) {
      debug.log('No wallet available')
      return
    }

    //owning address
    $('#owning_address_input').val(wallet.accounts[0].addresses[0].address);


    Reddcoin.messenger.getAddressBalance($('#owning_address_input').val(), function(data) {
      priv.balance = data.balance.confirmed;
      $('#owning_address_balance').val(`${data.balance.confirmed * COIN} RDD`)
    });

    window.setInterval(function () {
      Reddcoin.messenger.getAddressBalance($('#owning_address_input').val(), function(data) {
        priv.balance = data.balance.confirmed;
        $('#owning_address_balance').val(`${data.balance.confirmed * COIN} RDD`)
      })
    },5000);

  };


  
  exports.viewSocialNetworks = pub;
})(exports);

