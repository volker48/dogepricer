$(function () {
    var cryptsyEle = $('#cryptsyLastTrade'),
        vircurexEle = $('#vircurexLastTrade'),
        usdCryptsyEle = $('#usdCryptsyConversion'),
        usdVircurexEle = $('#usdVircurexConversion');

    function open_options_tab() {
        chrome.tabs.create({url: "options.html"});
    }

    $('#settings-div').click(open_options_tab);

    chrome.runtime.getBackgroundPage(function (backgroundPage) {
        var apiErrorMsg = 'API Error';
        function updateAPI(id, message) {
            id.html(message);
        }

        function cryptsySuccess(marketData) {
            updateAPI(cryptsyEle, marketData.cryptsy);
            marketData.cryptsyDone = true;
            updateUSDRates(marketData);
        }

        function cryptsyFail(error, marketData) {
            updateAPI(cryptsyEle, apiErrorMsg);
            marketData.cryptsyDone = true;
            marketData.cryptsyFailed = true;
            updateUSDRates(marketData);
        }

        function vircurexSuccess(marketData) {
            updateAPI(vircurexEle, marketData.vircurex);
            marketData.vircurexDone = true;
            updateUSDRates(marketData);
        }

        function vircurexFail(error, marketData) {
            updateAPI(vircurexEle, apiErrorMsg);
            marketData.vircurexDone = true;
            marketData.vircurexFailed = true;
            updateUSDRates(marketData);
        }

        function coindeskSuccess(marketData) {
            marketData.coindeskDone = true;
            updateUSDRates(marketData);
        }

        function coindeskFail(marketData) {
            marketData.coindeskDone = true;
            updateAPI(usdCryptsyEle, apiErrorMsg);
            updateAPI(usdVircurexEle, apiErrorMsg);
        }

        function updateUSDRates(marketData) {
            if (marketData.coindeskDone && marketData.vircurexDone && marketData.cryptsyDone) {
                if (marketData.vircurexFailed) {
                    updateAPI(usdVircurexEle, apiErrorMsg);
                } else {
                    updateAPI(usdVircurexEle, (marketData.usdRate * marketData.vircurex).toPrecision(2));
                }
                if (marketData.cryptsyFailed) {
                    updateAPI(usdCryptsyEle, apiErrorMsg);
                } else {
                    updateAPI(usdCryptsyEle, (marketData.usdRate * marketData.cryptsy).toPrecision(2));
                }
            }
        }

        var params = {
            scheduleRequest: false,
            vircurexSuccess: vircurexSuccess,
            cryptsySuccess: cryptsySuccess,
            cryptsyFail: cryptsyFail,
            vircurexFail: vircurexFail,
            coindeskSuccess: coindeskSuccess,
            coindeskFail: coindeskFail
        };

        backgroundPage.DogeHelper.getMarketData(params);

    });
});