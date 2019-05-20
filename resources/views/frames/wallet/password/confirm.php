<section class="wallet frame" id="frame-wallet-password-confirm">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Reddcoin Wallet: <b>Confirm Password</b></h3>
    </div>

    <p>
        Please enter your password again to make sure it is correct.
    </p>

    <p>
        <b>Enter the same password.</b>
    </p>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="wallet_password_confirm" type="password">
        </label>
    </div>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" id="walletConfirmPassword">Confirm Password</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" id="walletBackBtn" data-click="frame" data-frame="wallet-intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
