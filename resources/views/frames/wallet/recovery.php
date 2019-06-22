<section class="wallet frame" id="frame-wallet-recovery">
    <div class="page-header">
        <h4 class="page-header-title">To recover your wallet please insert your 12 word recovery phrase.</h4>
    </div>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="recovery_input" name="seed"></textarea>
            <span class="field-description" id="import_error"></span>
        </label>
    </div>


    <button class="wallet-button button button--center button--large button--black" data-click="frame" data-frame="wallet-create">
        Create Wallet
    </button>

    <button class="wallet-button button button--center button--large button--primary right" id="walletImportbtn">Import</button>
</section>
