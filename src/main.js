var DogeHelper = (function () {

    function storeCryptsy(data, marketData, cryptsySuccess) {
        marketData.cryptsy = data.return.markets.DOGE.lasttradeprice;
        cryptsySuccess(marketData);
    }

    function storeVircurex(data, marketData, vircurexSuccess) {
        marketData.vircurex = data.value;
        vircurexSuccess(marketData);
    }

    function scheduleMarketData() {
        chrome.alarms.create('checkMarkets', {periodInMinutes: 5});
    }

    function wrapCallback(marketData, storeCallback, successCallback) {
        return function(data) {
            storeCallback(data, marketData, successCallback);
        }
    }

    function getMarketData(params) {
        if (params.scheduleRequest) {
            scheduleMarketData();
        }
        var marketData = {};
        $.get('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132', wrapCallback(marketData, storeCryptsy, params.cryptsySuccess)).fail(params.cryptsyFail);
        $.get('https://vircurex.com/api/get_last_trade.json?base=DOGE&alt=BTC', wrapCallback(marketData, storeVircurex, params.vircurexSuccess)).fail(params.vircurexFail);
    }

    function showNotification(title, message) {
        if (chrome.notifications) {
            //The notifications seem to be buggy and despite what the docs say
            //if you've already displayed the notification once
            // unless you clear it first it won't show up after the first call.
            chrome.notifications.clear('priceAlert', function (wasCleared) {
                chrome.notifications.create('priceAlert',
                    {
                        title: title,
                        message: message,
                        type: 'basic',
                        iconUrl: 'img/icon48.png'
                    },
                    function (notificationID) {
                        //don't care we know the ID it's asinine this is required
                    }
                );
            });

        } else if (webkitNotifications) {
            //old chrome
            var notification = webkitNotifications.create('icon48.png', title, message);
            notification.show();
        }
    }

    return { getMarketData: getMarketData, showNotification: showNotification};
})();
