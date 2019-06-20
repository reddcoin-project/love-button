<section class="wallet frame frame--large" id="frame-wallet-create">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Write down your backup phrase on a piece of paper</h3>
        <span class="page-header-subtitle page-header-subtitle--small">
            The following 12 words are the only way to restore your account if lost. Keep them safe and secure.
        </span>
    </div>

    <p></p>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_recovery_phrase" readonly></textarea>
        </label>
    </div>

    <div class="wallet-header page-header" style='margin-top: 40px'>
        <h3 class="page-header-title">
            Confirm your backup phrase
        </h3>
        <span class="page-header-subtitle page-header-subtitle--small">
            Please enter the 12 word seed phrase.
        </span>
    </div>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_confirm_phrase"></textarea>
        </label>

        <span class="field-description" id="pwd_error"></span>
        <span class="field-description" id="recoverySeedError"></span>
    </div>

    <a class="wallet-button button button--black button--large" id="wallet_recovery_phrase_file">Save To File</a>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary right" id="walletConfirmWallet">
        Continue
    </button>

    <!-- <button class="wallet-button button button--large button--primary right" data-click="frame" data-frame="wallet-confirm">Continue</button> -->
</section>
