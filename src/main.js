var DogeHelper = (function () {

    var SATOSHI = 100000000;

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
        promises.cryptsy = getJSON('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132').then(storeCryptsy);
        promises.vircurex = getJSON('https://api.vircurex.com/api/get_last_trade.json?base=DOGE&alt=BTC').then(storeVircurex);
        Promise.any([promises.vircurex, promises.cryptsy]).then(DogeHelper.updateBadge);
        if (params.coindeskSuccess) {
            promises.coindesk =
                getJSON('https://api.coindesk.com/v1/bpi/currentprice.json')
                    .then(storeCoindesk);
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
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(items, function (items) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(items);
                }
            });
        });
    }

    function getJSON(url) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onreadystatechange = handler;
            req.setRequestHeader('Accept', 'application/json');
            req.send();
            function handler() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        resolve(JSON.parse(this.response));
                    } else {
                        reject(this);
                    }
                }
            }
        });
    }

    function updateBadge(value) {
        chrome.browserAction.setBadgeText({text: (value * SATOSHI).toString()});
    }

    return { getMarketData: getMarketData,
        showNotification: showNotification, syncGet: syncGet,
        getJSON: getJSON, updateBadge: updateBadge};
})();
