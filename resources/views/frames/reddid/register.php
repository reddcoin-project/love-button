<section class="wallet frame" id="frame-reddid-register">
    <div class="frame-spacer"></div>

    <button class="frame-button frame-button--left button button--black button--icon" data-click="frame" data-frame="wallet-interact">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
    </button>

    <div class="page-header">
        <h4 class="page-header-title">Create and register your ReddID name</h4>
        <span class="page-header-subtitle">
            You can create and link a ReddID to an Reddcoin address. In doing so you are able to link yor various social media accounts and allow cross network transactions.
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
        <span class="field-title">Username</span>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_input" placeholder="Register an ID" type="text">
        </label>

        <label class="field-text field-text--input">
            <input class="field-mask field-tag" id="redd_id_value" placeholder="0 RDD" type="text" readonly="readonly">
        </label>

        <span class="field-description" id="id_msg">Please enter a name to continue</span>
    </div>

    <button class="wallet-button button button--center button--large button--primary right" id="redd_id_btn_order">Order</button>
    <button class="wallet-button button button--center button--large button--black" id="redd_id_btn_register">Register</button>
</section>
