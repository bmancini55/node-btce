var request = require('request')
  , _ = require('underscore')

  , BtcePublicClient
  , apis
  , attachApis;

apis = {
  btcUsdTicker: 'https://btc-e.com/api/2/btc_usd/ticker',
  btcUsdTrades: 'https://btc-e.com/api/2/btc_usd/trades',
  btcUsdDepth: 'https://btc-e.com/api/2/btc_usd/depth',
  
  btcEurTicker: 'https://btc-e.com/api/2/btc_eur/ticker',
  btcEurTrades: 'https://btc-e.com/api/2/btc_eur/trades',
  btcEurDepth: 'https://btc-e.com/api/2/btc_eur/depth',

  ltcBtcTicker: 'https://btc-e.com/api/2/ltc_btc/ticker',
  ltcBtcTrades: 'https://btc-e.com/api/2/ltc_btc/trades',
  ltcBtcDepth: 'https://btc-e.com/api/2/ltc_btc/depth'
}

attachApis = function() {
  var me = this;
  _.chain(apis)
    .keys(apis)
    .each(function(api) {
      me[api] = function(cb) {
        me.papiRequest(apis[api], cb);
      }
    });
}

// # BtcePublicClient
/**
 * Client for connecting to BTC-E public API's
 * https://hdbtce.kayako.com/Knowledgebase/Article/View/28/4/public-api
 */
BtcePublicClient = function() {
  attachApis.call(this);
}

BtcePublicClient.prototype.papiRequest = function(url, cb) {
  request.get(url, function(err, res, body) {
    if(err) cb(err);
    else if (res.statusCode != 200) cb(new Error('Status code was not 200', res));
    else {
      var result = JSON.parse(body);
      cb(null, result);
    }
  });
};

module.exports = BtcePublicClient;
