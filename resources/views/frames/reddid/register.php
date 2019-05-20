<section class="wallet frame" id="frame-reddid-register">
    <div class="wallet-header page-header">
        <h3 class="page-header-title">Create and register your ReddID name</h3>
    </div>

    <p>
        You can create and link a ReddID to an Reddcoin address. In doing so you are able to link yor various social media accounts and allow cross network transactions.
    </p>

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
        <span class="field-title">Username</span>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_input" placeholder="Register an ID" type="text">
        </label>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_value" placeholder="0 RDD" type="text" readonly="readonly">
        </label>

        <span class="field-description">Please enter a name to continue</span>
        <span class="field-description" id="id_msg"></span>
    </div>

    <button class="wallet-button wallet-button--primary button button--center button--large button--primary" id="redd_id_btn_order">Order</button>
    <button class="wallet-button wallet-button--secondary button button--center button--large button--black" id="redd_id_btn_register">Register</button>
</section>
