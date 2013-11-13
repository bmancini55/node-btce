var PublicClient  = require('./lib/publicclient')
  , TradeClient   = require('./lib/tradeclient')
  , tradehelpers  = require('./lib/tradehelpers');

function Btce() {}
Btce.prototype.PublicClient = PublicClient;
Btce.prototype.TradeClient = TradeClient;
Btce.prototype.tradehelpers = tradehelpers;
module.exports = new Btce();
