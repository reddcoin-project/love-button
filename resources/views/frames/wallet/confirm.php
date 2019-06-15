<section class="wallet frame frame--large" id="frame-wallet-confirm">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">
            Confirm your backup phrase
        </h3>
        <span class="page-header-subtitle page-header-subtitle--small">
            Please enter the 12 word seed phrase.
        </span>
    </div>

    <p></p>

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
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" data-click="frame" data-frame="wallet-create">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
