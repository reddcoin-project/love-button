<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">

        <title>Reddid</title>

        <link href="assets/css/app.css" rel="stylesheet" id="stylesheet">

        <link href='https://fonts.googleapis.com/css?family=Montserrat:500,600,700' rel='stylesheet'>
    </head>

    <body id="reddidPopup">
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' data-mousedown="drag.start"
        data-mousemove="drag.move"
        data-mouseup="drag.stop"
        data-touchstart="drag.start"
        data-touchmove="drag.move"
        data-touchend="drag.stop" id='site'>
            <header class="header" id='header'>
               <img src="/assets/images/logo-reddid.svg" alt="" class="header-logo">

               <div class="header-refresh button button--grey button--icon tooltip" data-click='refresh' data-hover='toggle'>
                   <div class="icon">
                       <?= $svg('arrow/swap') ?>
                   </div>

                   <span class="tooltip-content tooltip-content--message tooltip-content--w">
                       Refresh Extension
                   </span>
               </div>
            </header>

            <div class="container container--small">
                <div class="create-reddid button button--center button--faded button--full button--green button--large reddid--button-replace" data-click="frame" data-frame="reddid-register" id="menuRegister">
                    Create a Reddid

                    <div class="button button--green button--icon button--static button--inline">
                        <div class="icon">
                            <?= $svg('plus') ?>
                        </div>
                    </div>
                </div>

                <section class="frames" id="frames">
                    <section class="nav" id="nav">
                        <div class="nav-link" data-click="frame" data-frame="feed">
                            <img src="assets/images/nav/feed.svg" alt="" class="nav-link-icon">
                            Tip Feed
                        </div>

                        <div class="nav-link" data-click="frame" data-frame="news">
                            <img src="assets/images/nav/news.svg" alt="" class="nav-link-icon">
                            News
                        </div>

                        <div class="nav-link nav-link--center reddid--greyed" data-click="frame" data-frame="reddid-register">
                            <div class="button button--green button--faded button--icon button--large tooltip" data-hover="toggle" id="menuRegister">
                                <div class="icon">
                                    <?= $svg('link') ?>
                                </div>

                                <span class="tooltip-content tooltip-content--n tooltip-content--message">Create a Reddid</span>
                            </div>
                        </div>

                        <div class="nav-link" data-click="frame" data-frame="wallet-interact">
                            <img src="assets/images/nav/wallet.svg" alt="" class="nav-link-icon">
                            Wallet
                        </div>

                        <div class="nav-link" data-click="frame" data-frame="settings">
                            <img src="assets/images/nav/setting.svg" alt="" class="nav-link-icon">
                            Settings
                        </div>
                    </section>

                    <?php
                        $frames = [
                            'wallet/password/create',
                            'wallet/password/success',
                            'wallet/create',
                            'wallet/intro',
                            'wallet/interact',
                            'wallet/recovery',
                            'wallet/settings',

                            'reddid/register',
                            'reddid/socials',

                            'feed',
                            'intro',
                            'news',
                            'settings',
                            'social',
                            'status'
                        ];

                        foreach ($frames as $frame) {
                            require __DIR__ . "/frames/{$frame}.php";
                        }
                    ?>

                    <span id="walletSwapInteract" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-interact"></span>
                    <span id="walletSwapPassword" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-password-create"></span>
                    <span id="walletSwapPasswordConfirm" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-password-confirm"></span>
                    <span id="walletSwapSettings" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-settings"></span>
                    <span id="walletSwapSuccess" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-password-success"></span>
                </section>
            </div>

            <div class="scrollbar scrollbar--fixed" id='site-scrollbar'></div>
        </section>

        <?php
            $files = [
                'vendor/browser-polyfill.min.js',
                'vendor/jquery-3.3.1.min.js',
                'vendor/jquery-ui.min.js',
                'vendor/typeahead.bundle.js',
                'init.js',
                'views/setupWallet.js',
                'views/viewNews.js',
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
                'vendor/sha256.min.js'
            ];
        ?>

        <?php foreach ($files as $file): ?>
            <script type="text/javascript" src="assets/js/html/<?= $file ?>"></script>
        <?php endforeach; ?>

        <script src="assets/js/app.js" type="text/javascript"></script>
    </body>
</html>
