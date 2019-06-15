<section class="wallet frame frame--large" id="frame-wallet-password-create">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Please create a password for your wallet</h3>
        <span class="page-header-subtitle page-header-subtitle--small">
            It must be at least 8 characters long.
        </span>
    </div>

    <p></p>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="wallet_password" type="password">
        </label>

        <span class="field-description" id="pwd_error"></span>
    </div>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" id="walletCreatePassword">Continue</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" data-click="frame" data-frame="wallet-create">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
