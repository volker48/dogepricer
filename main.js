var DogeHelper = (function() {
   var marketData = {};

   function updateCryptsy() {
       $('#cryptsyLastTrade').html(marketData.cryptsy.lasttradeprice);
   }

   function updateVircurex() {
       $('#vircurexLastTrade').html(marketData.vircurex);
   }

   function storeCryptsy(data) {
      marketData.cryptsy = data.return.markets.DOGE; 
      updateCryptsy();
   }

   function storeVircurex(data) {
       marketData.vircurex = data.value
       updateVircurex();    
   }

   function getMarketData() {
       $.get('http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132', storeCryptsy);
       $.get('https://vircurex.com/api/get_last_trade.json?base=DOGE&alt=BTC', storeVircurex);
   }

   return { getMarketData: getMarketData};
})();


$(function() {
    DogeHelper.getMarketData();
});
