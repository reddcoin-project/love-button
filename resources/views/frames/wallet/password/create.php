<section class="wallet frame" id="frame-wallet-password-create">
    <section class="page-section page-section--min">
        <div class="page-header">
            <h4 class="page-header-title">Please create a password for your wallet</h4>
            <span class="page-header-subtitle page-header-subtitle--small">
                It must be at least 8 characters long.
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="wallet_password" type="password">
            </label>

            <span class="field-description" id="pwd_error"></span>
        </div>
    </section>

    <section class="page-section page-section--min">
        <div class="page-header">
            <h4 class="page-header-title">Please enter your password again to make sure it is correct</h4>
            <span class="page-header-subtitle page-header-subtitle--small">
                Enter the same password
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="wallet_password_confirm" type="password">
            </label>
        </div>
    </section>

    <button class="wallet-button button button--center button--large button--primary right" id="walletConfirmPassword">Continue</button>
    <button class="wallet-button button button--center button--large button--black" data-click="frame" data-frame="wallet-create">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
