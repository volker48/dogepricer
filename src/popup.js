$(function () {
    var cryptsyEle = $('#cryptsyLastTrade'),
        vircurexEle = $('#vircurexLastTrade'),
        usdCryptsyEle = $('#usdCryptsyConversion'),
        usdVircurexEle = $('#usdVircurexConversion'),
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
        console.log(error);
        updateAPI(vircurexEle, apiErrorMsg);
    }

    function coindeskFail(error) {
        console.log(error);
        updateAPI(usdCryptsyEle, apiErrorMsg);
        updateAPI(usdVircurexEle, apiErrorMsg);
    }

    function updateUSDRates(settled) {
        var cryptsy = settled[0],
            vircurex = settled[1],
            coindesk = settled[2];

        if (coindesk.isRejected()) {
            coindeskFail();
            return;
        }
        if (vircurex.isRejected()) {
            updateAPI(usdVircurexEle, apiErrorMsg);
        } else {
            updateAPI(usdVircurexEle, (coindesk.value() * vircurex.value()).toPrecision(2));
        }
        if (cryptsy.isRejected()) {
            updateAPI(usdCryptsyEle, apiErrorMsg);
        } else {
            updateAPI(usdCryptsyEle, (coindesk.value() * cryptsy.value()).toPrecision(2));
        }
    }

    var params = {
        scheduleRequest: false,
        coindeskSuccess: true
    };
    var promises = DogeHelper.getMarketData(params);

    promises.cryptsy.then(cryptsySuccess).catch(cryptsyFail);
    promises.vircurex.then(vircurexSuccess).catch(vircurexFail);

    Promise.settle([promises.cryptsy, promises.vircurex, promises.coindesk]).then(updateUSDRates);

});
