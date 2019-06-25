<section class="wallet frame active" id="frame-wallet-interact">

    <div class="frame-spacer"></div>

    <section class='frame frame--min active' id="frame-wallet-balances">
        <section id='wallet-balance'></section>
        <section id='wallet-history'></section>
    </section>

    <button class="frame-button frame-button--left button button--black button--icon" data-click="frame" data-frame="wallet-balances">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
    </button>

    <section class='frame frame--border' id="frame-wallet-send" style='padding-bottom: 0;'>
        <div class="page-header">
            <h3 class="page-header-title">Send Reddcoin To:</h3>
        </div>


        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Saved Contacts and ReddID users
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_contactname" type="text" list="contacts">
            </label>

            <span class="field-description">
                Use this dropdown to select a ReddID user or saved contact. You can scroll through the list, or type a part of their name
            </span>
        </div>

        <datalist id="contacts"></datalist>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Reddcoin Address
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_address" type="text">
            </label>

            <span class="field-description">
                The address where you want to send. This can be populated by filling it in manually, or by selecting from the contacts list above.
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Contact Name (optional)
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_contact" type="text">
            </label>

            <span class="field-description">
                By adding a contact name, will save the details of this transaction into your address book.
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Reddcoin Amount
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="walletSend_amount" type="text">
            </label>

            <span class="field-description">
                The amount of Reddcoin to send.
            </span>
        </div>


        <div class="wallet-field field field--full field--grey" data-focusinout="toggle">
            <span class="field-title">Send from the following account</span>

            <label class="field-text field-text--select">
                <select class='field-mask' id="sendFromAccount"></select>
            </label>
        </div>


        <p id="error_msg"></p>
        <p id="send_error_msg_txt"></p>

        <button class="wallet-button button button--large button--primary right" id="walletSend_send">Send</button>

    </section>

    <section class='frame frame--border' id="frame-wallet-receive-table"></section>

</section>

<button class="frame-button frame-button--left button button--black button--icon tooltip" data-click="frame" data-frame="reddid-register" data-hover="toggle">
    <div class="icon">
        <?= $svg('user') ?>
    </div>

    <span class="tooltip-content tooltip-content--message tooltip-content--e">Register ReddID Name</span>
</button>
