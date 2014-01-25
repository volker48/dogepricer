var DogeHelper = (function () {

    function storeCryptsy(data) {
        return new Promise(function (resolve) {
            resolve(data.return.markets.DOGE.lasttradeprice);
        });
    }

    function storeVircurex(data) {
        return new Promise(function (resolve) {
            resolve(data.value);
        });
    }


    function storeCoindesk(data) {
        return new Promise(function (resolve) {
            resolve(data.bpi.USD.rate);
        });

    }

    function scheduleMarketData() {
        chrome.storage.sync.get(['polling_frequency'], function (items) {
            var timeout = 5;
            if (items.polling_frequency) {
                timeout = items.polling_frequency;
            }
            chrome.alarms.create('checkMarkets', {periodInMinutes: timeout});
        });

    }

    function getMarketData(params) {
        if (params.scheduleRequest) {
            scheduleMarketData();
        }
        var promises = {};
        promises.cryptsy = Promise.cast($.get('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132')).then(storeCryptsy);
        promises.vircurex = Promise.cast($.get('https://vircurex.com/api/get_last_trade.json?base=DOGE&alt=BTC')).then(storeVircurex);
        if (params.coindeskSuccess) {
            promises.coindesk = Promise.cast($.ajax(
                {
                    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
                    dataType: 'JSON',
                    type: 'GET'
                }
            )).then(storeCoindesk);
        }
        return promises;
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

    function syncGet(items) {
        return new Promise(function (resolve) {
            chrome.storage.sync.get(items, function(items) {
                resolve(items);
            });
        });
    }

    return { getMarketData: getMarketData,
        showNotification: showNotification, syncGet: syncGet};
})();
