var cryptsyEle = document.getElementById('cryptsyLastTrade'),
    vircurexEle = document.getElementById('vircurexLastTrade'),
    usdCryptsyEle = document.getElementById('usdCryptsyConversion'),
    usdVircurexEle = document.getElementById('usdVircurexConversion'),
    yourCryptsyEle = document.getElementById('yourCryptsy'),
    yourVircurexEle = document.getElementById('yourVircurex'),
    dogePerUsdVircurexEle = document.getElementById('dogePerUsdVircurex'),
    dogePerUsdCryptsyEle = document.getElementById('dogePerUsdCryptsy'),
    apiErrorMsg = 'API Error';

function open_options_tab() {
    chrome.tabs.create({url: "options.html"});
}

document.getElementById('settings-div').addEventListener('click', open_options_tab, false);

function updateAPI(id, message) {
    id.innerHTML = message;
}

function cryptsySuccess(cryptsy) {
    return new Promise(function (resolve) {
        updateAPI(cryptsyEle, cryptsy);
        resolve(cryptsy);
    });

}

function cryptsyFail(error) {
    updateAPI(cryptsyEle, apiErrorMsg);
}

function vircurexSuccess(vircurex) {
    return new Promise(function (resolve) {
        updateAPI(vircurexEle, vircurex);
        resolve(vircurex);
    });
}

function vircurexFail(error) {
    updateAPI(vircurexEle, apiErrorMsg);
}

function coindeskFail(error) {
    updateAPI(usdCryptsyEle, apiErrorMsg);
    updateAPI(usdVircurexEle, apiErrorMsg);
}

function updateUSDRates(settled) {
    var cryptsy = settled[0],
        vircurex = settled[1],
        coindesk = settled[2],
        storage = settled[3].value();

    if (coindesk.isRejected()) {
        coindeskFail();
        return;
    }
    if (vircurex.isRejected()) {
        updateAPI(usdVircurexEle, apiErrorMsg);
    } else {
        var vircurexUSDRate = coindesk.value() * vircurex.value();
        var vircurexDogePerUsd = 1.0 / vircurexUSDRate;
        updateAPI(usdVircurexEle, vircurexUSDRate.toPrecision(4));
        updateAPI(dogePerUsdVircurexEle, vircurexDogePerUsd.toFixed(2));
        if (storage.your_doge) {
            updateAPI(yourVircurexEle, '$' + (vircurexUSDRate * storage.your_doge).toFixed(2));
        }
    }
    if (cryptsy.isRejected()) {
        updateAPI(usdCryptsyEle, apiErrorMsg);
    } else {
        var cryptsyUSDRate = coindesk.value() * cryptsy.value();
        var cryptsyDogePerUsd = 1.0 / cryptsyUSDRate;
        updateAPI(usdCryptsyEle, cryptsyUSDRate.toPrecision(4));
        updateAPI(dogePerUsdCryptsyEle, cryptsyDogePerUsd.toFixed(2));
        if (storage.your_doge) {
            updateAPI(yourCryptsyEle, '$' + (cryptsyUSDRate * storage.your_doge).toFixed(2));
        }
    }
}

var params = {
    scheduleRequest: false,
    coindeskSuccess: true
};
var promises = DogeHelper.getMarketData(params);

promises.cryptsy.then(cryptsySuccess).catch(cryptsyFail);
promises.vircurex.then(vircurexSuccess).catch(vircurexFail);

var storagePromise = DogeHelper.syncGet(['your_doge']);

Promise.settle([promises.cryptsy, promises.vircurex, promises.coindesk, storagePromise]).then(updateUSDRates);
