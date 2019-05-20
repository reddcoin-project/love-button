<section class="wallet frame" id="frame-wallet-create">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Reddcoin Wallet: <b>Create</b></h3>
    </div>

    <p>
        This is your wallet recovery phrase.
    </p>

    <p>
        <b>
            Please save the following 12 words in a safe place. For your convenience these 12 words are automatically copied to the clipboard.
        </b>
    </p>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <label class="field-text field-text--textarea">
            <textarea class="field-mask field-tag field-tag--autoresize" id="wallet_recovery_phrase" name="seed" readonly>improve animal wreck you tired tribe sad picnic weasel bacon agent hobby</textarea>
        </label>
    </div>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" data-click="frame" data-frame="wallet-confirm">Create Wallet</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" id="walletBackBtn" data-click="frame" data-frame="wallet-intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
        <span class="inline-spacer inline-spacer--small"></span>
        Start Over
    </button>
</section>
