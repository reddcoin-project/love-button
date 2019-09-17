<section class="wallet frame" id="frame-reddid-register">
    <section class='frame frame--border active' id="frame-reddid-interact">
    <div class="page-header">
        <h4 class="page-header-title">Create and register your ReddID name</h4>
        <span class="page-header-subtitle">
            You can create and link your ReddID to a Reddcoin address.
            In doing so you are able to link your various social media
            accounts and allow cross network transactions
        </span>
    </div>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <span class="field-title">Funding Address</span>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="paying_address_input" readonly="readonly" type="text">
        </label>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_balance" readonly="readonly" type="text">
        </label>
    </div>

    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
        <span class="field-title">Desired Redd-ID Name</span>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_input" placeholder="Register an ID" type="text">
        </label>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_value" placeholder="0 RDD" type="text" readonly="readonly">
        </label>

        <span class="field-description" id="id_msg">Please enter a name to continue</span>
        <span class="field-description" id="id_submsg"></span>
        <span class="field-description" id="id_breadcrumb"></span>
        <span class="field-description" id="id_registration"></span>
    </div>
    <button class="wallet-button button button--center button--large button--primary right" id="redd_id_btn_create">Create ID</button>
        <p id="reddid_error_msg_txt"></p>
    </section>
    <section class='frame frame--border' id="frame-reddid-password">
    <div class="page-header">
        <h3 class="page-header-title">Wallet Password:</h3>
        <span class="page-header-subtitle">
            Please enter your wallet password.
            </span>
        <p id="frame-reddid-password-message" class="reddHide"></p>
    </div>
    <div class="wallet-field field field--full field--grey" data-focusinout='toggle' id="reddid_password_field">
            <span class="field-title">
                Enter Wallet Password
            </span>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="reddid_password" type="password">
        </label>

        <span class="field-description">
                The password you used to secure your wallet.
            </span>
    </div>
    <div class="wallet-buttons">
        <button class="button button--center button--large button--primary" data-click="frame" data-frame="reddid-interact" id="reddid_password_cancel">
            <span class="inline-spacer inline-spacer--small"></span>
            Cancel
        </button>

        <button class="button button--black button--center button--large right" id="reddid_password_send">
            <span class="inline-spacer inline-spacer--small"></span>
            Send
        </button>
    </div>
    <div id="walletSend_loading" class="wallet-row reddHide" style="text-align:center;">
        <i class="fa fa-refresh fa-spin fa-3x"></i>
    </div>
    </section>
</section>
