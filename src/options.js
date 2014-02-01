var $price_rise = document.getElementById('price-rise'),
    $price_drop = document.getElementById('price-drop'),
    $polling_frequency = document.getElementById('polling-frequency'),
    $your_doge = document.getElementById('your-doge'),
    $options_form = document.getElementById('options-form');

function save_options() {
    var polling_frequency = parseFloat($polling_frequency.value),
        tooFast = false,
        alerts = {};

    if (polling_frequency < 1.0) {
        polling_frequency = 1.0;
        tooFast = true;
    }
    if ($your_doge.value) {
        alerts.your_doge = parseFloat($your_doge.value.replace(',', ''));
    }
    alerts.price_rise = parseFloat($price_rise.value);
    alerts.price_drop = parseFloat($price_drop.value);
    alerts.polling_frequency = polling_frequency;

    function postStorageSet() {
        var status = document.getElementById("status");
        var message = "Options Saved.";
        if (tooFast) {
            message += " Your polling frequency is too fast it has been set to every minute";
            $polling_frequency.value = 1.0;
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
        $price_rise.value = formatFloat(items.price_rise);
    }
    if (items.price_drop) {
        $price_drop.value = formatFloat(items.price_drop);
    }
    if (items.polling_frequency) {
        $polling_frequency.value = items.polling_frequency;
    }
    if (items.your_doge) {
        $your_doge.value = items.your_doge;
    }
}

function options_submit(e) {
    e.preventDefault();
    save_options();
}

$options_form.addEventListener('submit', options_submit, false);

var items = ['price_rise', 'price_drop', 'polling_frequency', 'your_doge'];
chrome.storage.sync.get(items, restore_options);