<section class="wallet frame" id="frame-reddid-socials">

    <section class="page-section">
        <div class="page-header">
            <h4 class="page-header-title">Connect Your Social Media Accounts</h4>
        </div>

        <div class="settings-field field field--full field--grey" data-focusinout="toggle">
            <span class="field-title">Select A ReddID To Pair With Your Account</span>

            <label class="field-text field-text--select" data-change="select">
                <div class="field-mask"></div>

                <select class="field-tag" data-ref="trigger:change">
                    <option value="">ReddID Here</option>
                </select>
            </label>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="" type="hash" placeholder="ICJR TODO: When reddid is selected populate this field with 'reddid:user-reddid'">
            </label>

            <span class="field-description" id="">
                Please paste the text above on the social media account you are verifying.
                This code is only required for verification and can be removed once the reddid has been synced with your account.
            </span>
        </div>

        <div class="wallet-field field field--full field--grey" data-focusinout='toggle'>
            <span class="field-title">
                Full Url To Your Social Media Account
            </span>

            <label class="field-text field-text--input">
                <input class="field-mask field-tag" id="" type="hash">
            </label>

            <span class="field-description" id="">
                Ex: https://www.twitter.com/reddcoin
            </span>
        </div>

        <button class="wallet-button button button--center button--large button--primary right">Submit</button>
    </section>

    <section class="social-accounts">
        <div class="page-header" style='margin-top: 24px;'>
            <h4 class="page-header-title">Linked Social Accounts</h4>
        </div>

        <?php for($i = 0; $i < 10; $i++): ?>
            <div class="social-account">
                <div class="social-account-button social-account-button--left button button--icon button--small button--static button--twitter">
                    <div class="icon">
                        <?= $svg('social/twitter') ?>
                    </div>
                </div>

                <div class="text-list">
                    <b class="text">
                        <a href="https://www.twitter.com/reddcoin" class="link link--inline link--primary external-link">
                            https://www.twitter.com/reddcoin
                        </a>
                    </b>
                    <div class="text-group">
                        <b class="text text--small">Pending</b>
                        <span class="text text--small">Code: <b class='text--red'>reddid:reddcoin</b></span>
                    </div>
                </div>

                <div class="social-account-button social-account-button--right button button--grey button--icon button--small tooltip" data-hover='toggle'>
                    <div class="icon icon--small">
                        <?= $svg('close') ?>
                    </div>

                    <span class="tooltip-content tooltip-content--message tooltip-content--ne">Remove Account</span>
                </div>
            </div>
        <?php endfor; ?>
    </section>

</section>
