<section class="wallet frame" id="frame-wallet-recovery">

    <div class="frame-spacer"></div>

    <button class="intro-back frame-button frame-button--left button button--transparent button--icon" data-click="frame" data-frame="wallet-create">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>

        &nbsp; <b>Back</b>
    </button>

    <div class="page-header">
        <h4 class="page-header-title">To recover your wallet balance please insert your 12 word recovery phrase.</h4>
    </div>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="recovery_input" name="seed"></textarea>
            <span class="field-description" id="import_error"></span>
        </label>
    </div>

    <button class="wallet-button button button--center button--large button--primary right" id="walletImportbtn">Import</button>
</section>
