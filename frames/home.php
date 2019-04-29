<section class="index-frame">

    <span class="index-frame-tag">Home Frame</span>

    <header class="header">
        <div class="header-menu button button--icon button--grey button--text button--clear tooltip" data-click="toggle">
            <div class="icon" data-stopclick>
                <?= $svg("menu/hamburger") ?>
            </div>

            <div class="header-menu-dropdown tooltip-content tooltip-content--menu tooltip-content--sw" data-stopclick>
                <section class="link-menu link-menu--black">
                    <div class="link link--large link--white active">
                        <div class="icon">
                            <?= $svg('dashboard') ?>
                        </div>
                        <span class="inline-spacer"></span>
                        Dashboard
                    </div>

                    <div class="link link--large link--white">
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
        <div class="dashboard index-frame-content-wrapper">
            <div class="dashboard-accordion-title link link--full link--large link--text link--primary" data-click='accordion' data-accordion='accordion-0'>
                What is ReddID?

                <div class="accordion-arrow right icon">
                    <?= $svg('arrow/head/small') ?>
                </div>
            </div>
            <section class="accordion" id="accordion-0">
                <div class="dashboard-accordion-content">
                    <p>
                        ReddID is name-based tipping across social networks and platforms, with all data stored safetly in the blockchain.
                        No centralized sites and databases, no adminstrators with control over your funds.
                        Empower your online persona, collecting tips for your content and comments while keeping your wallet secure and private!
                    </p>
                </div>
            </section>

            <div class="dashboard-accordion-title link link--full link--large link--text link--primary" data-click='accordion' data-accordion='accordion-1'>
                How do I register a ReddId?

                <div class="accordion-arrow right icon">
                    <?= $svg('arrow/head/small') ?>
                </div>
            </div>
            <section class="accordion" id="accordion-1">
                <div class="dashboard-accordion-content">
                    <p>
                        Obtain RDD - As ReddID's require a small fee paid to the network, you'll need to obtain RDD.
                        This can be done from the Instant Buy button on the "exchange" Tab (coming soon), or from any crypto exchange trading RDD.
                        See the wiki for a full list.
                    </p>
                    <p>
                        Deposit RDD to your ReddID wallet - Public addresses for deposit are visible in the extension tab.
                        You may wish to send a very small amount of RDD initially as a test before sending larger amounts.
                    </p>
                    <p>
                        Select a ReddID name - Click on the "Register" tab and enter your desired ReddID name.
                        If it is available on the blockchain, the extension will let you know the cost required for that particular ReddID.
                        Ensuring you have adequate funds, click "Order".
                    </p>
                </div>
            </section>

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
