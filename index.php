<?php 

    $svg = function(string $name) {
    	require __DIR__ . "/assets/svgs/compressed/{$name}.svg";
    };

?>

<!DOCTYPE html>
<html lang='en'>
    <head>
        <?php // Preserve Order, These Tags Need To Be Listed First ?>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, height=device-height, initial-scale=1, minimum-scale=1, minimal-ui'>

        <title>Reddid Frontend Base</title>

        <?php // Application Details ?>
        <!--
        <meta name='apple-mobile-web-app-title' content=''>
        <meta name='application-name' content=''>''>
        <meta name='keywords' content=''>
        <link rel="manifest" href="/manifest.webmanifest">
        -->

        <?php // 150 Char Limit Description/Subject + Keywords ?>
        <!--
        <meta name='description' content=''>
        <meta name='subject' content=''>
        <meta name='keywords' content=''>
        -->

        <?php // Control Search Engine Behavior ?>
        <meta name='robots' content='index,follow'>
        <meta name='googlebot' content='index,follow'>

        <?php // iOS Add To Homescreen Capable ( Web App ) ?>
        <meta name='apple-mobile-web-app-capable' content='yes'>
        <!-- <meta name='apple-mobile-web-app-status-bar-style' content=''>
        <meta name='apple-mobile-web-app-title' content=''> -->

        <?php // Android Add To Homescreen ( Web App ) ?>
        <meta name='mobile-web-app-capable' content='yes'>
        <meta name='theme-color' content='#ffffff'>

        <?php // Software Used To Build The Application - Brand Opportunity ?>
        <!-- <meta name='generator' content=''> -->

        <?php // Twitter Card ?>
        <!--
        <meta name='twitter:card' content='summary_large_image'>
        <meta name='twitter:site' content='@'>
        <meta name='twitter:creator' content='@'>

        <meta name='twitter:title' content=''>
        <meta name='twitter:description' content=''>
        <meta name='twitter:image' content=''>
        <meta name='twitter:url' content=''>
        -->

        <?php // Facebook Social Graph ?>
        <!--
        <meta property='og:site_name' content=''>
        <meta property='og:locale' content='en_US'>
        <meta property='og:type' content='website'>

        <meta property='og:title' content=''>
        <meta property='og:description' content=''>
        <meta property='og:image' content=''>
        <meta property='og:url' content=''>
        -->

        <?php // Self Explanatory ?>
        <link rel='shortcut icon' href='/favicon.ico'>
        <link href='/assets/css/app.css' id='stylesheet' rel='stylesheet' type='text/css'>

        <link href='https://fonts.googleapis.com/css?family=Montserrat:500,600,700' rel='stylesheet'>

        <?php // Touch Icons ?>
        <!--
        <link href='' rel='apple-touch-icon' sizes='152x152' />
        <link href='' rel='apple-touch-icon' sizes='167x167' />
        <link href='' rel='apple-touch-icon' sizes='180x180' />
        <link href='' rel='icon' sizes='144x144' />
        <link href='' rel='icon' sizes='192x192' />
        -->

        <?php // NoJS ?>
        <noscript>
            Javascript Is Required To View This Website! <br />

            <a href='https://www.enable-javascript.com/' target='_blank'>
                Follow These Instructions To Enable Javascript In Your Web Browser.
            </a>
        </noscript>
    </head>
    <body>
        <section class='site' data-ref='scrollbar' data-scroll='scrollbar' data-scrollbar='site-scrollbar' id='site'>
            <section class='page' id='page'>
                <?php foreach(['home', 'wallet', 'wallet-create', 'wallet-create-confirm', 'wallet-recovery'] as $frame): ?>
					<?php require "frames/{$frame}.php" ?>
				<?php endforeach; ?>
            </section>

            <div class="scrollbar scrollbar--fixed" id='site-scrollbar'></div>
        </section>

        <script src='/assets/js/app.js'></script>
    </body>
</html>
