<section class="social frame" id="frame-social">
    <section class="page-section">
        <div class="social-header page-header page-header--center">
            <h4 class="page-header-title page-header-title--icon">
                Login To Your Social Media Accounts To Link Your ReddID
            </h4>
            <span class="page-header-subtitle">
                you can receive tips directly on twitter, etc. etc. by signing into your account using oauth
            </span>
        </div>
    </section>

    <section class="social-buttons button-group">
        <div class="button button--icon button--twitter tooltip" data-hover='toggle'>
            <div class="icon">
                <?= $svg('social/twitter') ?>
            </div>

            <span class="tooltip-content tooltip-content--message tooltip-content--n">Add New Account</span>
        </div>

        <div class="button button--icon button--facebook tooltip" data-hover='toggle'>
            <div class="icon">
                <?= $svg('social/facebook') ?>
            </div>

            <span class="tooltip-content tooltip-content--message tooltip-content--n">Add New Account</span>
        </div>

        <div class="button button--icon button--youtube tooltip" data-hover='toggle'>
            <div class="icon">
                <?= $svg('social/youtube') ?>
            </div>

            <span class="tooltip-content tooltip-content--message tooltip-content--n">Add New Account</span>
        </div>
    </section>

    <section class="social-accounts">
        <?php for($i = 0; $i < 10; $i++): ?>
            <div class="social-account">
                <div class="social-account-button social-account-button--left button button--icon button--small button--static button--twitter">
                    <div class="icon">
                        <?= $svg('social/twitter') ?>
                    </div>
                </div>

                <span class="text">@some_twitter_username</span>

                <div class="social-account-button social-account-button--right button button--black button--icon button--badge tooltip" data-hover='toggle'>
                    <div class="icon icon--small">
                        <?= $svg('close') ?>
                    </div>

                    <span class="tooltip-content tooltip-content--message tooltip-content--ne">Remove Account</span>
                </div>
            </div>
        <?php endfor; ?>
    </section>
</section>
