var _ = require('underscore');

/** 
 * Receives an array of elements in the form  [price, volume]
 * and detemins the price needed to get to a certain volume
 * @param {Array} pricepoints is an array of price|volume pairs
 * @param {numeric} volume is the intended buy volume
 * @returns {numeric} the price needed to reach the volume
 * @private
 */
function findPriceForVolume (pricepoints, volume, cb) {
  var totalvol = 0
    , price
    , i;
  for(i=0; i<pricepoints.length; i++) {    
    totalvol += pricepoints[i][1];
    if(totalvol >= volume) {
      price = pricepoints[i][0];
      break;
    }
  };
  if(price) {
    cb(null, price);
  } else {
    cb('Price not able to be calculated based on supplied depth');
  }
}

/**
 * 
 * Examines the depth chart and returns a price necessary
 * to buy a specific volume. Basically this calculates the
 * price needed to execute a buy order for a specific volume
 * and have the order execute immediately.
 * @param {Object} depth is the depth chart information
 * @param {Numeric} volume is the volume you wish to buy
 * @param {Function} cb is a callback in the form (err, price)
 */
exports.priceToBuyVolume = function(depth, volume, cb) {
  findPriceForVolume(depth.asks, volume, cb);
}

/**
 * 
 * Examines the depth chart and returns a price necessary
 * to sell a specific volume. Basically this calculates the
 * price needed to execute a sell order for a specific volume
 * and have the order execute immediately.
 * @param {Object} depth is the depth chart information
 * @param {Numeric} volume is the volume you wish to sell
 * @param {Function} cb is a callback in the form (err, price)
 */
exports.priceToSellVolume = function(depth, volume, cb) {
  findPriceForVolume(depth.bids, volume, cb); 
}
