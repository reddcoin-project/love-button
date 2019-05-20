<!DOCTYPE html>
<html class='html--center' lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">

        <title>Browser Extension Skeleton</title>

        <link href="assets/css/app.css" rel="stylesheet" id="stylesheet">

        <link href='https://fonts.googleapis.com/css?family=Montserrat:500,600,700' rel='stylesheet'>
    </head>

    <body class='body--center'>
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' id='site'>

            <section class="frames frames--center">

                <?php
                    $frames = [
                        'wallet/password/confirm',
                        'wallet/password/create',
                        'wallet/password/success',

                        'wallet/confirm',
                        'wallet/create',
                        'wallet/intro',
                        'wallet/recovery',
                        'wallet/settings'
                    ];

                    foreach ($frames as $frame) {
                        require __DIR__ . "/frames/{$frame}.php";
                    }
                ?>

                <span id="walletSwapPassword" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-password-create"></span>
                <span id="walletSwapPasswordConfirm" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-password-confirm"></span>
                <span id="walletSwapSettings" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-settings"></span>
                <span id="walletSwapSuccess" style='position: absolute; top: 0;left: 0; z-index: -1;opacity: 0;' data-click="frame" data-frame="wallet-password-success"></span>

            </section>

            <div class="scrollbar scrollbar--fixed" id='site-scrollbar'></div>
        </section>

        <?php
            $files = [
                'vendor/browser-polyfill.min.js',
                'vendor/jquery-3.3.1.min.js',
                'init.js',
                'views/setupWallet.js',
                'messenger.js'
            ];
        ?>

        <?php foreach ($files as $file): ?>
            <script type="text/javascript" src="assets/js/html/<?= $file ?>"></script>
        <?php endforeach; ?>

        <script src="assets/js/app.js" type="text/javascript"></script>
    </body>
</html>
