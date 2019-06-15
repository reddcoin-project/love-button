<section class="wallet-interact frame active" id="frame-wallet-interact">

    <div class="wallet-interact-links link-scroller">
        <span class="link link--border link--primary link--tab active" data-click="frame" data-frame="WalletBalances">
            Balance
        </span>
        <span class="link link--border link--primary link--tab" data-click="frame" data-frame="WalletHistoryTable">
            History
        </span>
        <span class="link link--border link--primary link--tab" data-click="frame" data-frame="WalletSend">
            Send
        </span>
        <span class="link link--border link--primary link--tab" data-click="frame" data-frame="WalletReceiveTable">
            Receive
        </span>
        <span class="link link--border link--primary link--tab" data-click="frame" data-frame="WalletHelp">
            Help
        </span>
    </div>

    <section class='wallet-interact-frames'>
        <section class='wallet-interact-frame active' id="WalletBalances"></section>

        <section class='wallet-interact-frame' id="WalletHistoryTable"></section>

        <section class='wallet-interact-frame' id="WalletSend">
            <div class="wallet-header page-header">
                <h3 class="page-header-title"><b>Send</b> Reddcoin To:</h3>
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

                <label class="field-text field-text--select" data-change="select">
                    <select id="sendFromAccount"></select>
                </label>
            </div>

            <button class="wallet-button button button--primary" id="walletSend_send">Send</button>

            <p id="error_msg"></p>
            <p id="send_error_msg_txt"></p>

        </section>

        <section class='wallet-interact-frame' id="WalletReceiveTable"></section>

        <section class='wallet-interact-frame' id="WalletHelp">
            <p>
                <b>Balance</b> check your total balance across all addresses in this wallet
            </p>
            <p>
                <b>History</b> check your total balance across all addresses in this wallet
            </p>
            <p>
                <b>Send</b> enter a public address or ReddID name to send the amount of your choice to the recipient.
            </p>
            <p>
                <b>Receive</b> your list of public addresses on which to receive direct payment. Separated into categories.
                All addresses belong to the same wallet and can be balance checked in the Wallet -> Balance tab.
                Features to come include additional address generation and custom categories.
            </p>
            <p>
                <b>Help</b> see Help.
            </p>
        </section>
    </section>

</section>
