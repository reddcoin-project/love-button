<section class="wallet frame" id="frame-wallet-settings">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Reddcoin Wallet: <b>Settings</b></h3>
    </div>

    <p>
        Please review the following settings.
    </p>

    <p>
        <b>If you are new to Reddcoin and ReddId, it is probably best to leave them as they are.</b>
    </p>

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
        Using the Tip Jar will give you an account that isn't password protected. This makes tipping faster and easier but is less secure.
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

    <p>
        Using the Tip Jar will give you an account that isn't password protected. This makes tipping faster and easier but is less secure.
    </p>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" id="walletSettingsCreateWallet">Create Wallet</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" id="walletBackBtn" data-click="frame" data-frame="wallet-intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
