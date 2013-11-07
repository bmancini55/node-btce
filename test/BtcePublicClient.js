var mocha = require('mocha')
  , chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , BtcePublicClient = require('../lib/BtcePublicClient')
  , request = require('request')
  , _ = require('underscore');

describe('BtcePublicClient', function() {
  var client = new BtcePublicClient();  

  describe('#papiRequest', function() {
      
  });

  describe('#btcUsdTicker', function() {
    it('should return json', function(done) {
      client.btcUsdTicker(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
  describe('#btcUsdTrades', function() {
    it('should return json', function(done) {
      client.btcUsdTrades(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
  describe('#btcUsdDepth', function() {
    it('should return json', function(done) {
      client.btcUsdDepth(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
 
  describe('#btcEurTicker', function() {
    it('should return json', function(done) {
      client.btcEurTicker(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
  describe('#btcEurTrades', function() {
    it('should return json', function(done) {
      client.btcEurTrades(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
  describe('#btcEurDepth', function() {
    it('should return json', function(done) {
      client.btcEurDepth(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  }); 

  describe('#ltcBtcTicker', function() {
    it('should return json', function(done) {
      client.ltcBtcTicker(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
  describe('#ltcBtcTrades', function() {
    it('should return json', function(done) {
      client.ltcBtcTrades(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  });
  describe('#ltcBtcDepth', function() {
    it('should return json', function(done) {
      client.ltcBtcDepth(function(err, res) {
        expect(res).is.not.null;
        done();
      });
    });
  }); 
 
});


