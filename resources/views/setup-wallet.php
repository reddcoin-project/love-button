<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">

        <title>Browser Extension Skeleton</title>

        <link href="assets/css/app.css" rel="stylesheet" id="stylesheet">

        <link href='https://fonts.googleapis.com/css?family=Montserrat:500,600,700' rel='stylesheet'>
    </head>

    <body>
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' id='site'>

            <section class="frames">

                <?php
                    $frames = [
                        'wallet/password/confirm',
                        'wallet/password/create',
                        'wallet/password/success',

                        'wallet/confirm',
                        'wallet/create',
                        'wallet/intro',
                        'wallet/settings'
                    ];

                    foreach ($frames as $frame) {
                        require __DIR__ . "/frames/{$frame}.php";
                    }
                ?>

            </section>

            <div class="scrollbar scrollbar--fixed" id='site-scrollbar'></div>
        </section>

        <?php
            $files = [
                'browser-polyfill.min.js',
                'jquery-3.3.1.min.js',
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
