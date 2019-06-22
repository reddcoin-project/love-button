const modal_new = `
    <div id="reddid_modal" class="reddid_tip_modal tip">
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' id="site">
            <header class="header">
                <div class="header-menu button button--icon button--grey button--text button--clear tooltip" id="reddid_tip_button_close_id" data-hover="toggle">
                    <div class="icon" data-stopclick>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M15.849 13.162L10.688 8l5.162-5.162a.302.302 0 0 0-.001-.425L13.586.15a.3.3 0 0 0-.424 0L8 5.313 2.838.151a.3.3 0 0 0-.424 0L.151 2.414a.3.3 0 0 0 0 .425L5.313 8 .151 13.162a.3.3 0 0 0 0 .424l2.263 2.263a.301.301 0 0 0 .425.001L8 10.688l5.162 5.162a.3.3 0 0 0 .424-.001l2.263-2.263a.3.3 0 0 0 0-.424z"/></svg>
                    </div>
                    <span class='tooltip-content tooltip-content--message tooltip-content--sw'>Close</span>
                </div>
                <img src="${browser.extension.getURL("assets/images/logo-reddid.svg")}" alt="" class="header-logo">
            </header>

            <section class="frames">
                <section class="wallet frame active">
                    <div class="page-header">
                        <h3 class="page-header-title">Send Reddcoin Tip To: <b id="reddid_tip_username_id">...</b></h3>
                    </div>

                    <div class="tip-qr">
                        <div class='tip-qr-code' id="qrimage"></div>
                    </div>

                    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
                        <span class='field-title'>Address</span>
                        <label class="field-text field-text--input">
                            <input class="field-mask field-tag" id="reddid_tip_input_address_id">
                        </label>
                        <span class='field-description'>Address Reddcoin will be sent to</span>
                    </div>

                    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
                        <span class='field-title'>How much do you want to tip?</span>

                        <label class="field-text field-text--input">
                            <input class="field-mask field-tag" id="reddid_tip_input_amount_id" placeholder="RDD">
                        </label>

                        <span class='field-description'>or pick an amount:</span>

                        <label class="field-text field-text--select" data-change="select">
                            <div class="field-mask">...</div>

                            <select class="field-tag" id="reddid_tip_select_amount_id">
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                            </select>
                        </label>
                    </div>

                    <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
                        <span class='field-title'>Comments</span>
                        <label class="field-text field-text--textarea">
                            <textarea class="field-mask field-tag field-tag--autoresize" id="reddid_tip_input_comment_id" data-keydown="autoresize">improve animal wreck you tired tribe sad picnic weasel bacon agent hobby</textarea>
                        </label>
                    </div>

                    <button class="wallet-button button button--center button--large button--primary" id="reddid_tip_button_sendtip_id">Send Tip</button>

                    <p id="reddid_tip_error_id"></p>
                    <p id="tipconfirmation_id">
                        Please confirm:
                        <span id="sendtip_yes" class="tipconfirmation_option">Yes</span> or
                        <span id="sendtip_no" class="tipconfirmation_option">No</span>
                    </p>
                </section>
            </section>

        </section>
    </div>
`;
