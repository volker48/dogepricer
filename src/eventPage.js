var apiErrorMessage = 'API Error';

function checkAlertThresholds(marketData) {
    return function (items) {
        var showAlert = false;
        if (items.price_rise && !marketData.cryptsyFailed) {
            if (parseFloat(marketData.cryptsy) > items.price_rise ||
                parseFloat(marketData.vircurex) > items.price_rise) {
                showAlert = true;
            }
        }
        if (items.price_drop && !marketData.vircurexFailed) {
            if (parseFloat(marketData.cryptsy) < items.price_drop ||
                parseFloat(marketData.vircurex) < items.price_drop) {
                showAlert = true;
            }
        }
        if (showAlert) {
            var message = 'Cryptsy Price: ' + marketData.cryptsy + '\n';
            message += 'Vircurex Price: ' + marketData.vircurex;
            DogeHelper.showNotification('Doge Price Alert', message);
        }
    };
}


function afterMarketChecks(marketData) {
    if (marketData.vircurexDone && marketData.cryptsyDone) {
        chrome.storage.sync.get(['price_rise', 'price_drop'], checkAlertThresholds(marketData));
    }
}

function cryptsySuccess(marketData) {
    marketData.cryptsyDone = true;
    afterMarketChecks(marketData);
}

function vircurexSuccess(marketData) {
    marketData.vircurexDone = true;
    afterMarketChecks(marketData);
}

function cryptsyFail(marketData) {
    marketData.cryptsyDone = true;
    marketData.cryptsyFailed = true;
    marketData.cryptsy = apiErrorMessage;
}

function vircurexFail(marketData) {
    marketData.vircurexDone = true;
    marketData.vircurexFailed = true;
    marketData.vircurex = apiErrorMessage;
}

function onAlarm(alarm) {
    if (alarm && alarm.name === 'checkMarkets') {
        var params = {
            scheduleRequest: true,
            cryptsySuccess: cryptsySuccess,
            cryptsyFail: cryptsyFail,
            vircurexSuccess: vircurexSuccess,
            vircurexFail: vircurexFail

        };
        DogeHelper.getMarketData(params)
    }
}

function onInit() {
    var params = {
        scheduleRequest: true,
        cryptsySuccess: cryptsySuccess,
        vircurexSuccess: vircurexSuccess
    };
    DogeHelper.getMarketData(params);
}

chrome.runtime.onInstalled.addListener(onInit);

chrome.runtime.onStartup.addListener(function () {
    var params = {
        scheduleRequest: true,
        cryptsySuccess: cryptsySuccess,
        vircurexSuccess: vircurexSuccess
    };
    DogeHelper.getMarketData(params);
});

chrome.alarms.onAlarm.addListener(onAlarm);
