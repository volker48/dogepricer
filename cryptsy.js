var DogeHelper = (function() {
   var marketData = {};

   function updateTradeSpan() {
       $('#lastTrade').html(marketData.lasttradeprice);
   }

   function calculateAverage() {
        var sum = 0.0;
        for (var i = 0; i < marketData.recenttrades.length; i++) {
            sum += parseFloat(marketData.recenttrades[i].price);
        }
        return sum / marketData.recenttrades.length
   }

   function updateAvgSpan() {
       var avg = calculateAverage();
       $('#avgPrice').text(avg);
   }

   function storeMarketData(data) {
      marketData = data.return.markets.DOGE; 
      updateTradeSpan();
      //updateAvgSpan();
   }

   function getMarketData() {
       $.get('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132', storeMarketData);
   }

   return { getMarketData: getMarketData};
})();


$(function() {
    DogeHelper.getMarketData();    
});
