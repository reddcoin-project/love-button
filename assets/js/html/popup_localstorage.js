function setWalletdata (data) {
    if (localStorage.wallet) {
        console.log("Wallet already exist");
        return
    }

    localStorage.setItem("wallet", JSON.stringify(data));
}

function getWalletdata () {
    if (localStorage.wallet) {
        var payload = JSON.parse(localStorage.wallet);
        console.log("Wallet data exist\n" + JSON.stringify(payload));
    }
}
