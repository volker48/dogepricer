$(function () {
    var $price_rise = $('#price-rise'),
        $price_drop = $('#price-drop'),
        $polling_frequency = $('#polling-frequency'),
        $your_doge = $('#your-doge');

    function save_options() {
        var polling_frequency = parseFloat($polling_frequency.val()),
            tooFast = false;

        if (polling_frequency < 1.0) {
            polling_frequency = 1.0;
            tooFast = true;
        }

        var alerts = {
            price_rise: parseFloat($price_rise.val()),
            price_drop: parseFloat($price_drop.val()),
            polling_frequency: polling_frequency,
            your_doge: parseFloat($your_doge.val())
        };

        function postStorageSet() {
            var status = document.getElementById("status");
            var message = "Options Saved.";
            if (tooFast) {
                message += " Your polling frequency is too fast it has been set to every minute";
                $polling_frequency.val('1.0');
            }
            status.innerHTML = message;
            setTimeout(function () {
                status.innerHTML = "";
            }, 2000);
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
        if (items.your_doge) {
            $your_doge.val(items.your_doge);
        }
    }

    $('#options-form').submit(function (e) {
        e.preventDefault();
        save_options();
    });
    var items = ['price_rise', 'price_drop', 'polling_frequency', 'your_doge'];
    chrome.storage.sync.get(items, restore_options);
});
