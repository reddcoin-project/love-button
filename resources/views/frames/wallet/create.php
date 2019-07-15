<section class="wallet frame" id="frame-wallet-create">

    <div class="frame-spacer"></div>

    <button class="intro-back frame-button frame-button--left button button--transparent button--icon" data-click="frame" data-frame="intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
    </button>

    <span class="wallet-steps">
        Step 1 of 3
    </span>

    <div class="page-header page-header--center">
        <h4 class="page-header-title">Recovery Phrase</h4>
        <span class="page-header-subtitle page-header-subtitle--small">
            Write down and save your recovery phrase
        </span>
    </div>

    <section class="page-section page-section--min">
        <div class="wallet-list list list--bulletpoint">
            <span class="list-item">
                Write your phrase and password down. Keep them safe.
            </span>
            <span class="list-item">
                Never share phrase with others
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <label class="field-text field-text--textarea">
                <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_recovery_phrase" readonly></textarea>
            </label>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle' id="confirm_seed_fields" style='display: none;'>
            <label class="field-text field-text--textarea">
                <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_confirm_phrase"></textarea>
            </label>

            <span class="field-description" id="pwd_error">Confirm your backup phrase</span>
            <span class="field-description" id="recoverySeedError"></span>
        </div>
    </section>

    <div class="intro-buttons">
        <a class="intro-button button button--black button--center button--large" id="wallet_recovery_phrase_file">Save To File</a>

        <button class="intro-button button button--center button--large button--primary" id="walletConfirmWallet" style='display: none;'>Continue</button>
    </div>
</section>
