var PublicClient = require('./lib/publicclient')
  , TradeClient = require('./lib/tradeclient');

function Btce() {}
Btce.prototype.PublicClient = PublicClient;
Btce.prototype.TradeClient = TradeClient;

module.exports = new Btce();
