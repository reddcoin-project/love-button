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
            <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_recovery_phrase" name="seed" readonly></textarea>
        </label>
    </div>

    <button class="wallet-button button button--large button--primary right" data-click="frame" data-frame="wallet-confirm">Continue</button>
</section>
