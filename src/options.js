$(function () {
    var $price_rise = $('#price-rise');
    var $price_drop = $('#price-drop');

    function save_options() {
        var alerts = {
            price_rise: $price_rise.val(),
            price_drop: $price_drop.val()
        };

        chrome.storage.sync.set(alerts, function () {
            var status = document.getElementById("status");
            status.innerHTML = "Options Saved.";
            setTimeout(function () {
                status.innerHTML = "";
            }, 750);
        });
    }

    function restore_options() {
        chrome.storage.sync.get(['price_rise', 'price_drop'], function (items) {
            if (items.price_rise) {
                $price_rise.val(items.price_rise);
            }
            if (items.price_drop) {
                $price_drop.val(items.price_drop);
            }
        });
    }

    restore_options();
    $('#options-form').submit(function (e) {
        e.preventDefault();
        save_options();
    });
});
