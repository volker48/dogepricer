var DogeHelper = (function () {
    var marketData = {};

    function storeCryptsy(data) {
        marketData.cryptsy = data.return.markets.DOGE.lasttradeprice;
        marketData.cryptsySuccess(marketData);
    }

    function storeVircurex(data) {
        marketData.vircurex = data.value;
        marketData.vircurexSuccess(marketData);
    }

    function scheduleMarketData() {
        chrome.alarms.create('checkMarkets', {periodInMinutes: 5});
    }


    function getMarketData(params) {
        if (params.scheduleRequest) {
            scheduleMarketData();
        }
        marketData.cryptsySuccess = params.cryptsySuccess;
        marketData.vircurexSuccess = params.vircurexSuccess;
        $.get('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132', storeCryptsy).fail(params.cryptsyFail);
        $.get('https://vircurex.com/api/get_last_trade.json?base=DOGE&alt=BTC', storeVircurex).fail(params.vircurexFail);
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
                        iconUrl: 'icon48.png'
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