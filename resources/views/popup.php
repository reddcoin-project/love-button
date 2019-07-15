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
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' id='site'>
            <div class="container container--small">
                <div class="frame-button frame-button--right button button--grey button--icon button--text tooltip" data-click="frame" data-frame="settings" data-hover="toggle" id="settings-toggle">
                    <div class="icon" data-stopclick>
                        <?= $svg("settings") ?>
                    </div>

                    <span class="tooltip-content tooltip-content--message tooltip-content--w">Settings</span>
                </div>

                <section class="frames">

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

                            'intro',
                            'settings',
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
