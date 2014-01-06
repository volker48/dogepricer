$(function () {
    var cryptsyEle = $('#cryptsyLastTrade'),
    vircurexEle = $('#vircurexLastTrade'),
    apiErrorMsg = 'API Error';

    chrome.runtime.getBackgroundPage(function (backgroundPage) {

        function updateAPI(id, message) {
            id.html(message);
        }

        function cryptsySucess(marketData) {
            updateAPI(cryptsyEle, marketData.cryptsy);
        }

        function vircurexSuccess(marketData) {
            updateAPI(vircurexEle, marketData.vircurex);
        }

        function vircurexFail() {
            updateAPI(vircurexEle, apiErrorMsg)
        }

        function cryptsyFail() {
            updateAPI(cryptsyEle, apiErrorMsg);
        }

        var params = {
            scheduleRequest: false,
            vircurexSuccess: vircurexSuccess,
            cryptsySuccess: cryptsySucess,
            cryptsyFail: cryptsyFail,
            vircurexFail: vircurexFail
        };

        backgroundPage.DogeHelper.getMarketData(params);

    });
});