<section class="wallet frame active" id="frame-wallet-interact">

    <section class='frame frame--min active' id="frame-wallet-balances">
        <section id='wallet-balance'></section>

        <div class="wallet-table">
            <div class="wallet-table-header">
                <span class="wallet-table-history">History</span>
                <span class="wallet-table-all link link--green right">See All</span>
            </div>

            <section id='wallet-history'></section>
        </div>
    </section>

    <section class='frame frame--border' id="frame-wallet-send" style='padding-bottom: 0;'>
        <button class="frame-button frame-button--left button button--white button--icon button--small" data-click="frame" data-frame="wallet-balances" style='margin: -2px 0;z-index: 2;'>
            <div class="icon icon--rotate180">
                <?= $svg('arrow/small') ?>
            </div>
        </button>

        <div class="page-header page-header--center">
            <h3 class="page-header-title">Send</h3>
        </div>

        <div class="wallet-field wallet-field--first field field--full field--grey field--horizontal" data-focusinout="toggle">
            <span class="field-title">From</span>

            <label class="wallet-field-right field-text field-text--select">
                <select class='field-mask' id="sendFromAccount" style='pointer-events: auto;'></select>
            </label>
        </div>

        <span class="wallet-field-left">To</span>

        <div class="wallet-field wallet-field-right field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                ReddID / Contact List
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_contactname" type="text" list="contacts">
            </label>

            <datalist id="contacts"></datalist>
        </div>

        <span class="wallet-field-right wallet-field-right--center">or</span>

        <div class="wallet-field wallet-field-right field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Reddcoin Address
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_address" type="text">
            </label>
        </div>

        <!-- <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Contact Name (optional)
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_contact" type="text">
            </label>
        </div> -->

        <div class="wallet-field field field--full field--grey field--horizontal" data-focusinout='toggle'>
            <span class="field-title">
                Amount
            </span>

            <label class="wallet-field-right field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_amount" type="text">
            </label>
        </div>


        <p id="error_msg"></p>
        <p id="send_error_msg_txt"></p>

        <section class="wallet-centered">
            <button class="wallet-button button button--faded button--green button--large" id="walletSend_send">Send</button>
        </section>

    </section>

    <section class='frame frame--border' id="frame-wallet-receive-table"></section>

</section>
