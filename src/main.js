var DogeHelper = (function () {

    function storeCryptsy(data, marketData, cryptsySuccess) {
        marketData.cryptsy = data.return.markets.DOGE.lasttradeprice;
        cryptsySuccess(marketData);
    }

    function storeVircurex(data, marketData, vircurexSuccess) {
        marketData.vircurex = data.value;
        vircurexSuccess(marketData);
    }


    function storeCoindesk(data, marketData, coindeskSuccess){
        marketData.usdRate = data.bpi.USD.rate;
        coindeskSuccess(marketData)
    }


    function scheduleMarketData() {
        chrome.storage.sync.get(['polling_frequency'], function(items) {
            var timeout = 5;
            if (items.polling_frequency) {
                timeout = items.polling_frequency;
            }
            chrome.alarms.create('checkMarkets', {periodInMinutes: timeout});
        });

    }

    function wrapCallback(marketData, storeCallback, successCallback) {
        return function (data) {
            storeCallback(data, marketData, successCallback);
        }
    }

    function wrapFailure(marketData, failureCallback) {
        return function(error) {
            failureCallback(error, marketData);
        };
    }

    function getMarketData(params) {
        if (params.scheduleRequest) {
            scheduleMarketData();
        }
        var marketData = {};
        $.get('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132', wrapCallback(marketData, storeCryptsy, params.cryptsySuccess)).fail(wrapFailure(marketData, params.cryptsyFail));
        $.get('https://vircurex.com/api/get_last_trade.json?base=DOGE&alt=BTC', wrapCallback(marketData, storeVircurex, params.vircurexSuccess)).fail(wrapFailure(marketData, params.vircurexFail));
        if (params.coindeskSuccess) {
            $.ajax(
                {
                    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
                    success: wrapCallback(marketData, storeCoindesk, params.coindeskSuccess),
                    error: wrapFailure(marketData, params.coindeskFail),
                    dataType: 'JSON',
                    type: 'GET'
                }
            );
        }
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
