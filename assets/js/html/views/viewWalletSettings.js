/*************************************************
* Template
* Setup initial state and extension settings
* Change the exports.template = public line to meet your needs
*************************************************/

(function (exports) {
    var priv = {},
        pub = {};

    function changeTheme(event) {
        debug.log(`clicked me ${event.target.value}`);

        document.body.setAttribute('data-theme', event.target.value);

        Reddcoin.messenger.setSetting('theme', event.target.value, function () {
            debug.log(`Theme ${event.target.value} Saved`);
        });
    }

    $(function () {
        $('.js-background-select').on("change", (event) => changeTheme(event));
    });

    exports.viewWalletSettings = pub;
})(exports);
