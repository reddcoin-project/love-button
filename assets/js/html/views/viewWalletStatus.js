/*************************************************
* Template
* Setup initial state and extension settings for status
*************************************************/

(function (exports) {

    var priv = {
            "versions": [
                {"version":"0.0.2","heading":"Version 0.0.2", "body":"Add Versioning, Display release notes on status tab"},
                {"version":"0.0.1","heading":"Version 0.0.1", "body":"Initial Release"}
            ]
        },
        pub = {};


    priv.compareVersion = function(v1, v2){
        if (typeof v1 !== 'string') return false;
        if (typeof v2 !== 'string') return false;

        v1 = v1.split('.');
        v2 = v2.split('.');

        const k = Math.min(v1.length, v2.length);

        for (let i = 0; i < k; ++ i) {
            v1[i] = parseInt(v1[i], 10);
            v2[i] = parseInt(v2[i], 10);

            if (v1[i] > v2[i]) return 1;
            if (v1[i] < v2[i]) return -1;
        }

        return v1.length === v2.length ? 0: (v1.length < v2.length ? -1 : 1);
    };

    priv.displayVersion = function() {
        document.getElementById('app_version').innerHTML = browser.runtime.getManifest().version;
    };

    priv.displayReleaseNotes = function() {
        let html = '';

        for (var x in priv.versions) {
            html += `${priv.versions[x].version} - ${priv.versions[x].body} <br />`;
        }

        document.getElementById('app_release').innerHTML = html;
    };

    priv.displayClientVersion = function(data) {
        let remoteVersion = data.version;
        let localVersion = browser.runtime.getManifest().version;
        let compare = priv.compareVersion(localVersion, remoteVersion );
        let msg, colorStyle;

        if (compare === -1){ // local is older than remote
            msg = `${remoteVersion} is available, please consider updating to make sure you have compatibility`;
            colorStyle = '#ff0000'
        }
        else if (compare === 0) { // versions match
            msg = `Congratulations you are up to date with ${remoteVersion}`;
            colorStyle = '#000000'
        }
        else if (compare === 1) { // local is newer
            msg = `The official supported version is ${remoteVersion}, while you are using ${localVersion}. Godspeed with beta testing! We look forward to your feedback`;
            colorStyle = '#e6762b'
        }

        document.getElementById('app_version_warning').innerHTML = msg;
        document.getElementById('app_version_warning').style.color = colorStyle;
    };


    pub.getView = function(data){
        if (data.connection) {
            document.getElementById('server_state').innerText = data.connection;
        }

        if (data.ping) {
            document.getElementById('ping_pong').innerText = `Ping: ${data.ping.ping} msecs`;
            document.getElementById('ping_pong_avg_10').innerText = `Avg 10: ${data.ping.ping_avg_10}`;
            document.getElementById('ping_pong_avg_30').innerText = `Avg 30: ${data.ping.ping_avg_30}`;
        }

        if (data.version) {
            priv.displayClientVersion(data)
        }

        priv.displayVersion();
        priv.displayReleaseNotes();
    };


    exports.viewWalletStatus = pub;

})(exports);
