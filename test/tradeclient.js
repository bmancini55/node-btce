var chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , request = require('request')
  , TradeClient = require('../lib/tradeclient.js')
  
describe('TradeClient', function() {
  var options
    , client;

  options = {
    publicKey: 'KG0WYOOL-GYP3XCR2-D5Z92RK1-X40GPGIM-LQ55SEO9',
    privateKey: 'b3e615891fbb07f6ea870c9b468362cf8e5ff46ef716f64923896b2d77e55bbd'
  };       
  client = new TradeClient(options);
 
  describe('#sign()', function() {
    it('should hash', function() {
      var result = client.sign('derp');
      expect(result).to.equal('18c4cb1dac0de76621b7cac0f0ee15d7f3674486b0d89098741f6b73f0e64451fcb5416b9d21469b92703b16a707929873e204f24a89b0d11f02d0cd9253b5d3');
    });
  });

  describe('#getNonce()', function() {
    it('should be between 1 and 4294967296', function(done) {
      client.getNonce(function(err, nonce) {            
        expect(err).to.be.null;
        expect(nonce).to.be.gt(0).and.lt(4294967297);
        done();
      });
    });
    it('should increment with each request', function(done) {
      client.getNonce(function(err, nonce) {
        client.getNonce(function(err, nonce2) {
          expect(nonce).to.be.lt(nonce2);
          done();
        });        
      });
    });
  });

  describe('#tapiRequest()', function() {
    describe('with null params', function() {   
      it('should return error', function(done) {
        client.tapiRequest(null, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });
    describe('with method absent from params', function() {
      it('should return error', function(done) {
        client.tapiRequest({}, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });
    describe('with valid params', function() {
      var noncestub
        , signstub
        , reqstub
        , params = {
            method: 'Trade',
            pair: 'ltc_btc',
            type: 'buy',
            rate: 0.02,
            amount: 10
          };

      before(function() {
        noncestub = sinon
          .stub(client, 'getNonce')
          .yields(null, 1000);
        signstub = sinon
          .stub(client, 'sign')
          .returns('asdfasdf');
      });
      after(function() {
        noncestub.restore();
        signstub.restore();
      });
      beforeEach(function() {
        reqstub = sinon.stub(request, 'post');
      });
      afterEach(function() {
        reqstub.restore();
      });
    
      describe('all requests', function() {
        beforeEach(function() {
          reqstub.yields(null, {statusCode:200}, JSON.stringify({success:1}));
        });
        it('should request correct url', function(done) {
          client.tapiRequest(params, function(err, res) {
            var url = reqstub.getCall(0).args[0];
            expect(url).to.equal('https://btc-e.com/tapi');
            done();
          });
        });
        it('should have expected form data', function(done) {        
          client.tapiRequest(params, function(err, res) {
            var form = reqstub.getCall(0).args[1].form;
            expect(form.method).to.equal('Trade');
            expect(form.nonce).to.equal(1000);
            expect(form.pair).to.equal('ltc_btc');
            expect(form.type).to.equal('buy');
            expect(form.rate).to.equal(0.02);
            expect(form.amount).to.equal(10);
            done();
          });     
        });
        it('should have expected headers', function(done) {
          client.tapiRequest(params, function(err, res) {
            var headers = reqstub.getCall(0).args[1].headers;
            expect(headers.Key).to.equal(options.publicKey);
            expect(headers.Sign).to.equal('asdfasdf');
            expect(headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
            expect(headers['Content-Length']).to.equal(65);
            done();
          });
        });
      });

      describe('when error response', function() {
        beforeEach(function() {
          reqstub.yields(new Error('Failed to connect'), null, null);
        });
        it('should result in error callback', function(done) {
          client.tapiRequest(params, function(err, res) {
            expect(err).to.not.be.null;
            done();
          });
        });
      });
      describe('when non 200 response', function() {
        beforeEach(function() {
          reqstub.yields(null, { statusCode: 503 }, '<html>Something is borked</html>');
        });
        it('should result in error callback', function(done) {
          client.tapiRequest(params, function(err, res) {
            expect(err).to.not.be.null;
            done();
          });
        });
      });
      describe('when 200 response', function() {
        beforeEach(function() {
          reqstub.yields(null, {statusCode:200}, JSON.stringify({success:1,"return":{}}));
        });
        it('should return json result', function(done) {
          client.tapiRequest(params, function(err, res) {
            expect(res.success).to.equal(1);
            expect(res.return).to.not.be.null;
            done();
          });
        });
      });

    }); // with valid param
  }); // #tapiRequest

  describe('#getInfo()', function() {   
  });

  describe('#transHistory()', function() {

  });

  describe('#tradeHistory()', function() {
    
  });

  describe('#trade()', function() {        
    describe('missing "pair" param', function() {
      it('should have error callback', function(done) {
        client.trade({ type: '', rate: 1, amount: 1 }, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });
    describe('missing "type" param', function() {
      it('should have error callback', function(done) {
        client.trade({ pair: '', rate: 1, amount: 1 }, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });
    describe('missing "rate" param', function() {
      it('should have error callback', function(done) {
        client.trade({ pair: '', type: '', amount: 1 }, function(err) {
          expect(err).to.not.be.null;
          done()      
        });
      });
    });
    describe('missing "amount" param', function() {
      it('should have error callback', function(done) {
        client.trade({ pair: '', type: '', rate: 1 }, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });
  }); // #trade

  describe('#cancelOrder()', function() {
    describe('missing "order_id" param', function() {
      it('should have error callback', function(done) {
        client.cancelOrder({ }, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });
  }); // #cancelOrder


});
