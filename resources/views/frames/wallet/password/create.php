<section class="wallet frame" id="frame-wallet-password-create">

    <div class="frame-spacer"></div>

    <button class="intro-back frame-button frame-button--left button button--transparent button--icon" data-click="frame" data-frame="wallet-create">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
    </button>

    <span class="wallet-steps">
        Step 2 of 3
    </span>

    <div class="page-header page-header--center">
        <h4 class="page-header-title">Password</h4>
        <span class="page-header-subtitle page-header-subtitle--small">
            Lorem ipsum
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
            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="wallet_password" type="password">
            </label>

            <span class="field-description" id="pwd_error">Password must be longer than 8 characters</span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="wallet_password_confirm" type="password">
            </label>

            <span class="field-description" id="pwd_error">Confirm your password</span>
        </div>
    </section>

    <div class="intro-buttons">
        <button class="intro-button button button--center button--large button--primary" id="walletConfirmPassword">Continue</button>
    </div>
</section>
