<section class="wallet frame" id="frame-wallet-confirm">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Reddcoin Wallet: <b>Confirm Seed</b></h3>
    </div>

    <p>
        To make sure you havent already lost your seed phrase, please enter it below.
    </p>

    <p>
        <b>
            Please enter the 12 word seed phrase.
        </b>
    </p>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_confirm_phrase" name="seed"></textarea>
        </label>

        <span class="field-description" id="pwd_error"></span>
        <span class="field-description" id="recoverySeedError"></span>
    </div>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" id="walletConfirmWallet">
        Confirm Wallet Seed
    </button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" id="walletBackBtn" data-click="frame" data-frame="wallet-intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
