$(function () {
    var cryptsyEle = $('#cryptsyLastTrade'),
        vircurexEle = $('#vircurexLastTrade'),
        usdCryptsyEle = $('#usdCryptsyConversion'),
        usdVircurexEle = $('#usdVircurexConversion'),
        yourCryptsyEle = $('#yourCryptsy'),
        yourVircurexEle = $('#yourVircurex'),
        apiErrorMsg = 'API Error';

    function open_options_tab() {
        chrome.tabs.create({url: "options.html"});
    }

    $('#settings-div').click(open_options_tab);

    function updateAPI(id, message) {
        id.html(message);
    }

    function cryptsySuccess(cryptsy) {
        return new Promise(function(resolve) {
            updateAPI(cryptsyEle, cryptsy);
            resolve(cryptsy);
        });

    }

    function cryptsyFail(error) {
        updateAPI(cryptsyEle, apiErrorMsg);
    }

    function vircurexSuccess(vircurex) {
        return new Promise(function(resolve) {
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
            updateAPI(usdVircurexEle, vircurexUSDRate.toPrecision(4));
            if (storage.your_doge) {
                updateAPI(yourVircurexEle, '$' + (vircurexUSDRate * storage.your_doge).toFixed(2));
            }
        }
        if (cryptsy.isRejected()) {
            updateAPI(usdCryptsyEle, apiErrorMsg);
        } else {
            var cryptsyUSDRate = coindesk.value() * cryptsy.value();
            updateAPI(usdCryptsyEle, cryptsyUSDRate.toPrecision(4));
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

});
