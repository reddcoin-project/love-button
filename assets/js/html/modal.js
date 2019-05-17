// get popup header image
const header_img = browser.extension.getURL("assets/images/reddcoinlogo.png");

console.log(`Get header Path = ${header_img}`);

const modal_new = `
    <div id="reddid_modal" class="reddid_tip_modal">
        <div class="reddid_tip_dialog">
            <div class="reddid_tip_sidecol">
                <img class="reddid_tip_logo" src="  header_img  "/>
            </div>

            <div class="reddid_tip_maincol">
                <div class="reddid_tip_header">
                    <span class="reddid_tip_title">Send Reddcoin Tip to </span>
                    <span class="reddid_tip_username" id="reddid_tip_username_id">...</span>
                </div>

                <div class="reddid_tip_body">
                    <div>
                        <p class="reddid_tip_caption">Address</p>
                        <p><input id="reddid_tip_input_address_id" class="reddid_tip_input reddid_tip_input_address"
                        placeholder="Address Reddcoin will be sent to"/></p>
                    </div>

                    <div>
                        <p class="reddid_tip_caption">How much do you want to tip?</p>
                        <p>
                            <input class="reddid_tip_input reddid_tip_input_amount" id="reddid_tip_input_amount_id" placeholder="RDD"/>

                            <label for="reddid_tip_select_amount_id" class="reddid_tip_caption"> or pick an amount:</label>
                            <select id="reddid_tip_select_amount_id" class="reddid_tip_dropdown" >
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100" selected="selected">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                            </select>
                        </p>
                    </div>

                    <div>
                        <p class="reddid_tip_caption">Comments</p>
                        <p><textarea id="reddid_tip_input_comment_id" class="reddid_tip_textarea reddid_tip_input_comment" placeholder="Comments"></textarea></p>
                    </div>
                </div>
            </div>

            <div class="reddid_tip_sidecol">
                <span id="reddid_tip_button_close_id" class="reddid_tip_button_close">X</span>
            </div>
        </div>

        <div class="reddid_tip_footer">
            <div class="reddid_tip_actions">
                <div class="reddid_tip_sidecol"></div>
                <button class="reddid_tip_button_sendtip" id="reddid_tip_button_sendtip_id">Send Tip</button>
                <span class="reddid_tip_error" id="reddid_tip_error_id"></span>
                <div id="tipconfirmation_id" class="tipconfirmation">
                    Please confirm:
                    <span id="sendtip_yes" class="tipconfirmation_option">Yes</span> or
                    <span id="sendtip_no" class="tipconfirmation_option">No</span>
                </div>
            </div>
        </div>
    </div>
`;
