<section class="wallet frame" id="frame-wallet-settings">

    <div class="frame-spacer"></div>

    <button class="intro-back frame-button frame-button--left button button--transparent button--icon" data-click="frame" data-frame="wallet-password-create">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>

        &nbsp; <b>Back</b>
    </button>

    <span class="wallet-steps">
        Step 3 of 3
    </span>

    <div class="page-header page-header--center">
        <h3 class="page-header-title"><b>Please review the following settings</b></h3>
        <span class="page-header-subtitle page-header-subtitle--small">
            If you are new to Reddcoin and ReddId, it is probably best to leave them as they are.
        </span>
    </div>

    <section class="page-section page-section--min">
        <div class="wallet-field field field--full field--grey" data-focusinout="toggle">
            <span class="field-title">Use Tip Jar</span>

            <label class="field-text field-text--select" data-change="select">
                <div class="field-mask"></div>

                <select class="field-tag" id="useTipJar" data-ref="trigger:change">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </label>
        </div>

        <p>
            Using the tip jar will let you tip up to a certain threshold, making tipping faster and easier. The threshold can be adjusted in settings.
        </p>

        <div class="wallet-field field field--full field--grey" data-focusinout="toggle">
            <span class="field-title">Savings Account</span>

            <label class="field-text field-text--select" data-change="select">
                <div class="field-mask"></div>

                <select class="field-tag" id="useSavingsAccount" data-ref="trigger:change">
                    <option value="false">I don't need a Savings Account</option>
                    <option value="true">Yes, I want a Savings Account</option>
                </select>
            </label>
        </div>

        <div class="wallet-field field field--primary" data-change='checkbox'>
            <label class="field-check field-check--checkmark">
                <span class="field-title">Make savings account spendable</span>

                <span class="field-mask">
                    <input class="field-tag" type="checkbox" checked="true" id="spendSavings" data-ref='trigger:change'>
                </span>
            </label>
        </div>
    </section>

    <div class="intro-buttons">
        <button class="intro-button button button--center button--large button--primary right" id="walletSettingsCreateWallet">Create Wallet</button>
    </div>
</section>
