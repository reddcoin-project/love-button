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

            <select class="field-tag" name="" data-ref="trigger:change">
                <option value="">No</option>
                <option value="">Yes</option>
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

            <select class="field-tag" name="" data-ref="trigger:change">
                <option value="">I don't need a Savings Account</option>
                <option value="">Yes, I want a Savings Account</option>
            </select>
        </label>
    </div>

    <div class="wallet-field field field--primary" data-change='checkbox'>
        <label class="field-check field-check--checkmark">
            <span class="field-title">Make savings account spendable</span>

            <span class="field-mask">
                <input class="field-tag" type="checkbox" data-ref='trigger:change'>
            </span>
        </label>
    </div>

    <p>
        Using the Tip Jar will give you an account that isn't password protected. This makes tipping faster and easier but is less secure.
    </p>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary">Create Wallet</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black">
        <div class="icon icon--rotate180">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.556 2.555a.3.3 0 0 0-.424 0l-.99.99a.3.3 0 0 0 0 .424L12.172 7H0v2h12.172l-3.03 3.03a.302.302 0 0 0 0 .424l.99.99a.3.3 0 0 0 .424 0L16 8l-5.444-5.445z"/></svg>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
