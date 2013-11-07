// # BtceTradeClient Module
// Defines a module for using BTC-E's trading API
// as defined https://btc-e.com/api/documentation

// Module dependencies
var request         = require('request')
  , querystring     = require('querystring')
  , crypto          = require('crypto')
  , _               = require('underscore')
  
// Variables
  , BtceTradeClient
  , defaults


// ## Default configuration
/**
 * Hash default values
 * @type {Object} 
 */
var defaults = {
  // Seed value used to get nonce start close to 0
  // since Nonce generation is by # of ticks since epoch
  // this value can be set to new Date().getTime() the first
  // time a key pair is used
  nonceSeed: 1383915514486,         

  // BTC-E trade api uri
  tradeApiUri: 'https://btc-e.com/tapi'
}


// ## Module Methods
/**
 * @method BtceTradeClient
 * @returns {*}
 * @constructor
 */
BtceTradeClient = function(config) {

  // generate config  
  this.config = _.extend(_.clone(defaults), config);

};

/** 
 * @method sign Signs the supplied value
 * @param {string} payload
 * @returns {string} HMAC hash of the payload
 */
BtceTradeClient.prototype.sign = function(payload) {
  var hmac = crypto.createHmac('sha512', this.config.privateKey);
  return hmac.update(payload).digest('hex').toString();
}

/**
 * @method getNonce Gets a nonce value according to
 *  to the rules of BTCE nonce generation. Uses timeout to 
 *  prevent nonce collision when fired repeatedly.
 * @param {function} cb Callback fired after nonce generation
 */ 
BtceTradeClient.prototype.getNonce = function(cb) {
  var me = this;  
  
  // generates nonce based off of current date time
  // and uses nonce seed to get value closer to 0
  setTimeout(function() {
    var result = Math.floor((new Date()).getTime()) - me.config.nonceSeed;   
    cb(null, result); 
  }, 1);
}

/** 
 * @method tapiRequest Makes a request to the trade api
 * @param {Object} params a hash of parametersa
 * @param {Funcction} cb function matching node callback signature
 */
BtceTradeClient.prototype.tapiRequest = function(params, cb) {
  var me = this;

  if(!params || !params.method) {
    cb(new Error('Supplied params to #tapiRequest are invalid'));
    return;
  }
 
  me.getNonce(function(err, nonce) {
    var data
      , options;

    data = _.extend(params, {
      nonce: nonce
    });
    options = {
      form: data,
      headers: {
        'Key': me.config.publicKey,
        'Sign': me.sign(querystring.stringify(data)),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(data)),
      }
    };
    request.post(me.config.tradeApiUri, options, function(err, response, body) {
      if(err) {
        cb(err);
      } 
      else if(response.statusCode != 200) {
        var err = new Error('Request status code: ' + response.statusCode);
        cb(err);
      } else {    
        var result = JSON.parse(body);
        cb(null, result);
      }
    });
  });
}

function validateParams(required, params) {
  var result = [];
  _.each(required, function(prop) {
    if(!params[prop]) {
      result.push(prop);
    }
  });  
  return result;
}


BtceTradeClient.prototype.getInfo = function(cb) {
  var me = this
    , req = { method: 'getInfo' };

  me.tapiRequest(req, cb);  
}

BtceTradeClient.prototype.transHistory = function(params, cb) {
  var me = this
    , req = _.extend(params, { method: 'TransHistory' });

  me.tapiRequest(req, cb); 
};

BtceTradeClient.prototype.tradeHistory = function(params, cb) {
  var me = this
    , req = _.extend(params, { method: 'TradeHistory' });

  me.tapiRequest(req, cb);
};

BtceTradeClient.prototype.trade = function(params, cb) {
  var me = this
    , req = _.extend(params, { method: 'Trade' })
    , required = ['pair', 'type', 'rate', 'amount']
    , validation = validateParams(required, req);
  
  if(validation.length > 0){
    cb(new Error('Required param missing', validation));   
  } else {
    me.tapiRequest(req, cb);
  }
};

BtceTradeClient.prototype.cancelOrder = function(params, cb) {
  var me = this
    , req = _.extend(params, { method: 'CancelOrder' })
    , required = ['order_id']
    , validation = validateParams(required, req);

  if(validation.length > 0) {
    cb(new Error('Required param missing', validation));
  } else {
    me.tapiRequest(req, cb);
  }
};

module.exports = BtceTradeClient;   
