var apiErrorMessage = 'API Error';

function afterMarketChecks(marketData) {
    if (marketData.vircurexDone && marketData.cryptsyDone) {
        console.log('Both markets done');
        delete marketData.vircurexDone;
        delete marketData.cryptsyDone;
        var message = 'Cryptsy Price: ' + marketData.cryptsy + '\n';
        message += 'Vircurex Price: ' + marketData.vircurex;
        DogeHelper.showNotification('Doge Price Alert', message);
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
    marketData.cryptsy = apiErrorMessage;
}

function vircurexFail(marketData) {
    marketData.vircurexDone = true;
    marketData.vircurex = apiErrorMessage;
}

function onAlarm(alarm) {
    console.log('Alarm fired!');
    if (alarm && alarm.name === 'checkMarkets') {
        console.log('Alarm is for checkMarkets');
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
