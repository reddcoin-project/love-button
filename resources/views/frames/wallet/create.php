<section class="wallet frame" id="frame-wallet-create">
    <section class="page-section page-section--min">
        <div class="page-header">
            <h4 class="page-header-title">Write down your backup phrase on a piece of paper</h4>
            <span class="page-header-subtitle page-header-subtitle--small">
                The following 12 words are the only way to restore your account if lost. Keep them safe and secure.
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <label class="field-text field-text--textarea">
                <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_recovery_phrase" readonly></textarea>
            </label>
        </div>
    </section>

    <section class="page-section page-section--min">
        <div class="page-header">
            <h4 class="page-header-title">
                Confirm your backup phrase
            </h4>
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
    </section>

    <a class="wallet-button button button--black button--large" id="wallet_recovery_phrase_file">Save To File</a>

    <button class="wallet-button button button--center button--large button--primary right" id="walletConfirmWallet">
        Continue
    </button>
</section>
