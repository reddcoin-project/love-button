<section class="wallet frame" id="frame-wallet-recovery">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Reddcoin Wallet: <b>Recovery</b></h3>
    </div>

    <p>
        <b>
            To recover your wallet please insert your 12 word recovery phrase.
        </b>
    </p>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="recovery_input" name="seed"></textarea>
            <span class="field-description" id="import_error"></span>
        </label>
    </div>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" id="walletImportbtn">Import</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" id="walletBackBtn" data-click="frame" data-frame="wallet-intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
