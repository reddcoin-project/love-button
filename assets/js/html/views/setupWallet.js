/*************************************************
 * setupWallet
 * Setup initial wallet state and extension settings
 *
 *************************************************/

// plugin to add 'enterKey' function to $
$.fn.enterKey = function (fnc) {
  return this.each(function () {

    $(this).keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);

      if (keycode == '13') {
        fnc.call(this, event);
      }
    })
  })
};


(function (exports) {
  var priv = {},
    pub = {};

  /*Private*/
  priv.swapPages = function (show, hide) {
    $(hide).hide(0, function () {
      $(show).show(0, function () {
        $("textarea, input, select", $(show)).filter(":first").focus();
      });
    });
  };

  priv.cleanSeed = function (selector) {
    let seed = $(selector).val();
    //replace multiple spaces with one
    seed = seed.replace(/\s{2,}/g, ' ');
    return $.trim(seed)
  };

  priv.seedsMatch = function () {
    const created = priv.cleanSeed('#wallet_recovery_phrase');
    const confirm = priv.cleanSeed('#wallet_confirm_phrase');
    return created === confirm;
  };

  priv.passwordsMatch = function () {
    const created = $('#wallet_password').val();
    const confirm = $('#wallet_password_confirm').val();
    return created === confirm;
  };

  /*Public*/
  pub.copyRecoveryPhrase = function () {
    $('#wallet_recovery_phrase').focus().select();
    try {
      const successful = document.execCommand('copy');
      debug.log('Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
    } catch (err) {
      debug.log('Oops, unable to copy ' + err);
      $('#recoveryPhraseCopyFailed').innerText = 'Could not copy to clipboard';
    }
  };

  pub.startNew = function () {
    debug.log('StartNew');
    Reddcoin.messenger.getNewSeed(function (seed) {
        $('#confirm_seed_fields').hide();
        $('#walletConfirmWallet').hide();

     $("#wallet_confirm_phrase").val('');
      $("#wallet_recovery_phrase").val(seed);

      let file = new Blob([seed], {type: 'text/plain'}),
          link = $("#wallet_recovery_phrase_file");

         link.show();

    let today = new Date(),
        timestamp = `${today.getMonth()}_${today.getDate()}_${today.getFullYear()}_${today.getHours()}:${today.getMinutes()}`;

      link.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(seed));
      link.attr('download', `reddid_seed_${timestamp}.txt`);

      priv.swapPages('#walletCreating', '#walletCreate');

      link.click(function() {
          $('#confirm_seed_fields').show();
          $('#walletConfirmWallet').show();

          $(this).hide();
      });
    });
  };

  pub.createWallet = function () {
    debug.log('createWallet');
    pub.copyRecoveryPhrase();
    $("#wallet_confirm_phrase").val('');
    priv.swapPages('#walletConfirming', '#walletCreating')

  };

  pub.walletConfirmWallet = function () {
    debug.log('walletConfirmWallet');
    $('#recoverySeedError').hide();

    if (!priv.seedsMatch()) {
      $('#recoverySeedError').text('Seeds do not match. Words must be exactly the same order and the same count. Please try again');
      $('#recoverySeedError').show();
      return;
    }

    $('#recoverySeedError').text('');
    $('#walletSwapPassword').trigger('click');
  };

  pub.walletCreatePassword = function () {
    debug.log('walletCreatePassword');
    let pw = $('#wallet_password').val();
    if (pw.length < 8) {
      $('#pw_error').show();
      return;
    }
    $('#pw_error').hide();
    $('#walletSwapPasswordConfirm').trigger('click');
  };

  pub.walletPasswordConfirm = function () {
    debug.log('walletPasswordConfirm');

    let pw = $('#wallet_password').val();

    if (!pw || pw.length < 8) {
      $('#pw_error').show();
      return;
    }

    $('#pw_error').hide();

    if (!priv.passwordsMatch()) {
      $('#pwd_error').text('Passwords do not match. Please try again');
      $('#wallet_password').val('');
      $('#wallet_password_confirm').val('');
      $('#pwd_error').show();
      $('#walletSwapPassword').trigger('click');
      return
    }
    $('#pwd_error').hide();
    $('#pwd_error').text('Password must be longer than 8 characters');
    $('#walletSwapSettings').trigger('click');
  };

  pub.walletSettings = function () {
    debug.log('walletSettings');
    let seed = $('#wallet_confirm_phrase').val();
    if (seed === '') {
      seed = $('#recovery_input').val();
    }
    let password = $('#wallet_password_confirm').val();
    let savingsAccountType = 'watch';
    if ($('#spendSavings').is(':checked')) {
      savingsAccountType = 'encrypted';
    }
    if ($('#useSavingsAccount').val() === 'false') {
      savingsAccountType = false;
    }
    Reddcoin.messenger.setSetting('tipJarEnabled', $('#useTipJar').val(), function () {
      Reddcoin.messenger.seedWallet(seed, password, savingsAccountType, function (data) {
        if (data.error === true) {
          alert("something went wrong.");
          debug.log(data.error);
        } else {
          debug.log("Create new wallet successful");
          $('#walletSwapSuccess').trigger('click');
          Reddcoin.messenger.createUser(true, function(data){
            debug.log(data);
          })
        }
      });
    });
  };

  pub.startImport = function () {
    debug.log('startImport');
  };

  pub.finishImport = function () {
    debug.log('finishImport');
    let seed = $('#recovery_input').val();

    $('[data-frame="wallet-create"]').hide();

    Reddcoin.messenger.checkSeed(seed, function (isValid) {
      if (!isValid) {
        //$error.show('slow');
        debug.log("Seed not valid");
        $('#import_error').text('Your seed is invalid. Please fix any mistakes and try again');
        $('#import_error').show();
        return
      }
      $('#walletSwapPassword').trigger('click');
    })
  };

  pub.startOver = function () {
    debug.log('startOver');
    location.reload();
  };

  pub.walletFinished = function () {
    debug.log('walletFinished');
    window.close();
  };

  $(function () {
    $('[data-frame="wallet-create"]').on('click', () => pub.startNew());

    $('#walletCreateWallet').on('click', () => pub.createWallet());
    $("#wallet_recovery_phrase").enterKey(pub.createWallet);

    $('#walletConfirmWallet').on('click', () => pub.walletConfirmWallet());
    $('#wallet_confirm_phrase').enterKey(pub.walletConfirmWallet);

    $('#walletCreatePassword').on('click', () => pub.walletCreatePassword());
    $('#wallet_password').enterKey(pub.walletCreatePassword);

    $('#walletConfirmPassword').on('click', () => pub.walletPasswordConfirm());
    $('#wallet_password_confirm').enterKey(pub.walletPasswordConfirm);

    $('#walletSettingsCreateWallet').on('click', () => pub.walletSettings());
    $('[data-frame="wallet-recovery"]').on('click', () => pub.startImport());

    $('#walletImportbtn').on('click', () => pub.finishImport());
    $("#recovery_input").enterKey(pub.finishImport);

    $('#extension_reload').on('click', () => {
        if (chrome) {
            chrome.tabs.reload();
        }
        else {
            browser.tabs.reload();
        }
    })

    //$('#walletBackBtn').on('click', () => pub.startOver());
    //$('#registerContinue').on('click', () => pub.walletFinished());
  });

  exports.setupWallet = pub;
})(exports);
