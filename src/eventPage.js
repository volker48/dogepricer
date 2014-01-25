function checkAlertThresholds(settled) {
    return function (items) {
        var showAlert = false;
        if (items.price_rise) {
            if (settled[0].isFulfilled()) {
                if (parseFloat(settled[0].value()) > items.price_rise) {
                    showAlert = true;
                }
            }
            if (settled[1].isFulfilled()) {
                if (parseFloat(settled[1].value()) > items.price_rise) {
                    showAlert = true;
                }
            }
        }
        if (items.price_drop) {
            if (settled[0].isFulfilled()) {
                if (parseFloat(settled[0].value()) < items.price_drop) {
                    showAlert = true;
                }
            }
            if (settled[1].isFulfilled()) {
                if (parseFloat(settled[1].value()) < items.price_drop) {
                    showAlert = true;
                }
            }
        }
        if (showAlert) {
            var cryptsy = settled[0].isFulfilled() ? settled[0].value() : "Cryptsy Error";
            var vircurex = settled[1].isFulfilled() ? settled[1].value() : "Vircurex Error";
            var message = 'Cryptsy Price: ' + cryptsy + '\n';
            message += 'Vircurex Price: ' + vircurex;
            DogeHelper.showNotification('Doge Price Alert', message);
        }
    };
}

function onAlarm(alarm) {
    if (alarm && alarm.name === 'checkMarkets') {
        onInit();
    }
}

function onInit() {
    var params = {
        scheduleRequest: true
    };
    var promises = DogeHelper.getMarketData(params);
    Promise.settle([promises.cryptsy, promises.vircurex]).then(function (settled) {
        chrome.storage.sync.get(['price_rise', 'price_drop'], checkAlertThresholds(settled));
    });
}

chrome.runtime.onInstalled.addListener(onInit);

chrome.runtime.onStartup.addListener(onInit);

chrome.alarms.onAlarm.addListener(onAlarm);
