$(function () {
    var $price_rise = $('#price-rise'),
        $price_drop = $('#price-drop'),
        $polling_frequency = $('#polling-frequency');

    function save_options() {
        var polling_frequency = parseInt($polling_frequency.val()),
            tooFast = false;
        if (polling_frequency < 1) {
            polling_frequency = 1;
            tooFast = true;
        }
        var alerts = {
            price_rise: parseFloat($price_rise.val()),
            price_drop: parseFloat($price_drop.val()),
            polling_frequency: polling_frequency
        };

        function postStorageSet() {
            var status = document.getElementById("status");
            var message = "Options Saved.";
            if (tooFast) {
                message += " Your polling frequency is too fast it has been set to every minute";
            }
            status.innerHTML = message;
            setTimeout(function () {
                status.innerHTML = "";
            }, 1000);
        }

        chrome.storage.sync.set(alerts, postStorageSet);
    }

    function restore_options(items) {

        if (items.price_rise) {
            var formattedRise = formatFloat(items.price_rise);
            $price_rise.val(formattedRise);
        }
        if (items.price_drop) {
            var formattedDrop = formatFloat(items.price_drop);
            $price_drop.val(formattedDrop);
        }
        if (items.polling_frequency) {
            $polling_frequency.val(items.polling_frequency);
        }
    }

    $('#options-form').submit(function (e) {
        e.preventDefault();
        save_options();
    });

    chrome.storage.sync.get(['price_rise', 'price_drop', 'polling_frequency'], restore_options);
});
