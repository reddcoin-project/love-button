<section class="index-frame">

    <span class="index-frame-tag">Wallet Recovery Frame</span>

    <header class="header">
        <div class="header-menu button button--icon button--grey button--text button--clear tooltip" data-click="toggle">
            <div class="icon" data-stopclick>
                <?= $svg("menu/hamburger") ?>
            </div>

            <div class="header-menu-dropdown tooltip-content tooltip-content--menu tooltip-content--sw" data-stopclick>
                <section class="link-menu link-menu--black">
                    <div class="link link--large link--white">
                        <div class="icon">
                            <?= $svg('dashboard') ?>
                        </div>
                        <span class="inline-spacer"></span>
                        Dashboard
                    </div>

                    <div class="link link--large link--white active">
                        <div class="icon">
                            <?= $svg('bank-activity') ?>
                        </div>
                        <span class="inline-spacer"></span>
                        Wallet
                    </div>

                    <div class="link link--large link--white">
                        <div class="icon">
                            <?= $svg('question') ?>
                        </div>
                        <span class="inline-spacer"></span>
                        FAQ
                    </div>

                    <div class="link link--large link--white">
                        <div class="icon">
                            <?= $svg('notification/success') ?>
                        </div>
                        <span class="inline-spacer"></span>
                        Status
                    </div>

                    <div class="link link--large link--white">
                        <div class="icon">
                            <?= $svg('notification/info') ?>
                        </div>
                        <span class="inline-spacer"></span>
                        About
                    </div>
                </section>
            </div>
        </div>

        <img src="/assets/images/logo-reddid.svg" alt="" class="header-logo">

        <div class="header-user button button--icon button--grey button--text button--clear tooltip" data-hover="toggle">
            <div class="icon icon--large" data-stophover>
                <?= $svg("user") ?>
            </div>

            <span class="tooltip-content tooltip-content--message tooltip-content--se">Sign In</span>
        </div>
    </header>

    <section class="index-frame-content">
        <div class="wallet index-frame-content-wrapper">

            <div class="wallet-header page-header">
                <h3 class="page-header-title">Reddcoin Wallet: <b>Recovery</b></h3>
            </div>

            <div class="wallet-field field field--white field--required field--primary" data-focusinout="toggle">
                <span class="field-title">Insert your 12 word recovery phrase</span>

                <label class="field-text field-text--input">
                    <input class="field-mask field-tag" name='identifier' type="text">
                </label>
            </div>

            <button class="wallet-button wallet-button--primary button button--center button--large button--primary">Import</button>
            <button class="wallet-button wallet-button--secondary button button--center button--large button--black">
                <div class="icon icon--rotate180">
                    <?= $svg('arrow/small') ?>
                </div>
                <span class="inline-spacer inline-spacer--small"></span>
                Start Over
            </button>

        </div>

        <section class="index-frame-footer">
            <img src="/assets/images/powered-by.svg" alt="" class="index-frame-footer-logo">

            <div class="index-frame-footer-links">
                <div class="index-frame-footer-link button button--icon button--primary button--transparent">
                    <div class="icon">
                        <?= $svg('web') ?>
                    </div>
                </div>

                <div class="index-frame-footer-link button button--icon button--facebook button--transparent">
                    <div class="icon">
                        <?= $svg('social/facebook') ?>
                    </div>
                </div>

                <div class="index-frame-footer-link button button--icon button--reddit button--transparent">
                    <div class="icon">
                        <?= $svg('social/reddit') ?>
                    </div>
                </div>

                <div class="index-frame-footer-link button button--icon button--twitter button--transparent">
                    <div class="icon">
                        <?= $svg('social/twitter') ?>
                    </div>
                </div>
            </div>
        </section>
    </section>

</section>
