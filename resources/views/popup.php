<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">

        <title>Browser Extension Skeleton</title>

        <link href="assets/css/app.css" rel="stylesheet" id="stylesheet">

        <link href='https://fonts.googleapis.com/css?family=Montserrat:500,600,700' rel='stylesheet'>
    </head>

    <body id="reddidPopup">
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' id='site'>

            <header class="header">
                <div class="header-menu button button--icon button--grey button--text button--clear tooltip" data-click="toggle">
                    <div class="icon" data-stopclick>
                        <?= $svg("menu/hamburger") ?>
                    </div>

                    <div class="header-menu-dropdown tooltip-content tooltip-content--menu tooltip-content--sw" data-stopclick>
                        <section class="link-menu link-menu--black">
                            <div class="link link--large link--white active" data-click="frame" data-frame="dashboard">
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

                            <div class="link link--large link--white" data-click="frame" data-frame="reddid-register">
                                <div class="icon">
                                    <?= $svg('user') ?>
                                </div>
                                <span class="inline-spacer"></span>
                                Register
                            </div>

                            <div class="link link--large link--white" data-click="frame" data-frame="buy-sell">
                                <div class="icon">
                                    <?= $svg('arrow/swap') ?>
                                </div>
                                <span class="inline-spacer"></span>
                                Buy/Sell
                            </div>

                            <div class="link link--large link--white" data-click="frame" data-frame="settings">
                                <div class="icon">
                                    <?= $svg('settings') ?>
                                </div>
                                <span class="inline-spacer"></span>
                                Settings
                            </div>

                            <div class="link link--large link--white" data-click="frame" data-frame="status" id="menuStatus">
                                <div class="icon">
                                    <?= $svg('notification/success') ?>
                                </div>
                                <span class="inline-spacer"></span>
                                Status
                            </div>

                            <div class="link link--large link--white" data-click="frame" data-frame="about">
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
            </header>


            <section class="frames">

                <?php
                    $frames = [
                        'reddid/create',

                        'about',
                        'buy-sell',
                        'dashboard',
                        'settings',
                        'status'
                    ];

                    foreach ($frames as $frame) {
                        require __DIR__ . "/frames/{$frame}.php";
                    }
                ?>

            </section>


            <footer class="footer">
                <img src="assets/images/powered-by.svg" alt="" class="footer-logo">

                <div class="footer-links">
                    <div class="footer-link button button--icon button--primary button--transparent">
                        <div class="icon">
                            <?= $svg('web') ?>
                        </div>
                    </div>

                    <div class="footer-link button button--icon button--facebook button--transparent">
                        <div class="icon">
                            <?= $svg('social/facebook') ?>
                        </div>
                    </div>

                    <div class="footer-link button button--icon button--reddit button--transparent">
                        <div class="icon">
                            <?= $svg('social/reddit') ?>
                        </div>
                    </div>

                    <div class="footer-link button button--icon button--twitter button--transparent">
                        <div class="icon">
                            <?= $svg('social/twitter') ?>
                        </div>
                    </div>
                </div>
            </footer>

            <div class="scrollbar scrollbar--fixed" id='site-scrollbar'></div>
        </section>

        <?php
            $files = [
                'browser-polyfill.min.js',
                'jquery-3.3.1.min.js',
                'jquery-ui.min.js',
                'typeahead.bundle.js',
                'init.js',
                'views/viewSocialNetworks.js',
                'views/viewWalletAccount.js',
                'views/viewWalletBalance.js',
                'views/viewWalletHistory.js',
                'views/viewWalletRegister.js',
                'views/viewWalletReceive.js',
                'views/viewWalletStatus.js',
                'views/viewWalletSettings.js',
                'views/viewWalletSend.js',
                'popup.js',
                'popup_localstorage.js',
                'popup_ui.js',
                'utils.js',
                'messenger.js',
                'sha256.min.js'
            ];
        ?>

        <?php foreach ($files as $file): ?>
            <script type="text/javascript" src="assets/js/html/<?= $file ?>"></script>
        <?php endforeach; ?>

        <script src="assets/js/app.js" type="text/javascript"></script>
    </body>
</html>
