function setWalletdata (data) {
    if (localStorage.getItem('wallet')) {
        console.log("Wallet already exist");
        return
    }

    localStorage.setItem("wallet", JSON.stringify(data));
}

function getWalletdata () {
    if (localStorage.getItem('wallet')) {
        var payload = JSON.parse(localStorage.getItem('wallet'));
        console.log("Wallet data exist\n" + JSON.stringify(payload));
    }
}
