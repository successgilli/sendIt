'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../dist/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);
var expect = _chai2.default.expect;
var should = _chai2.default.should();

//id and data kept here for reference through out
var id = void 0;
var data = void 0;

//test get welcome message routes
describe("test for welcome route", function () {
  it("should return a string ", function (done) {
    _chai2.default.request(_app2.default).get('/api/v1').end(function (req, res) {
      res.body.should.be.equal('welcome to Gilberts API. nav to "/parcels " for all orders, post ur order to "/parcels", get all orders by a user from "/users/userName/parcels", cancel order from "/parcels/parcelID/cancel" and get specific parcel with "/parcel/parcelsID" ');
      res.should.have.status(200);
    });
    done();
  });
});

//get parcel rote test
describe(' test the get parcel route "/"parcels', function () {

  var param = '/api/v1/parcels';

  it('should respond an empty object since empty ', function (done) {

    _chai2.default.request(_app2.default).get(param).end(function (err, res) {
      res.should.have.status(200);
      res.body.should.be.a('array');
    });

    done();
  });
});

//test for post /parcels route
describe(' test the post parcel route /parcels', function () {

  var param = '/api/v1/parcels';
  //default values kept in array to be used to simulate multiple post requests
  data = [{
    name: 'gilbert',
    item: 'girls',
    pickup_location: 'ikorodu'
  }, {
    name: 'edwin',
    item: 'eggs',
    pickup_location: 'cape town'
  }, {
    name: 'edwin',
    item: 'men',
    pickup_location: 'star city'
  }, {
    name: 'gilbert',
    item: 'knife',
    pickup_location: 'kano'
  }, {
    name: 'gilbert',
    item: 'buns',
    pickup_location: 'Ph city'
  }];

  it('should respond with status 201 showing order has been created and a json of what I sent and must generate id for each parcel', function (done) {
    //post each data in array above to the post parcel route and ensure the response is json of the post
    data.forEach(function (x) {
      _chai2.default.request(_app2.default).post(param).send(x).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        id = res.body.id;
        res.body.should.have.property('pickup_location');
        res.body.should.have.property('id');
      });
    });

    done();
  });
});

// test for the get parcel with Parcel  ID
describe(' test the get route "/parcels/:parcelsId" ', function () {

  var param = '/api/v1/parcels/:parcelId';

  it('should respond with status 404 if ID not found and return not found message', function (done) {

    _chai2.default.request(_app2.default).get(param).end(function (err, res) {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.value.should.equal('not found');
    });

    done();
  });

  it('should give status of 200 if ID found and return the order data', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/parcels/' + id).end(function (err, resp) {
      resp.should.have.status(200);
      resp.body.should.be.a('object');
      resp.body.should.have.property('id');
    });
    done();
  });
});

// test  for the get parcels of a user route.
describe(' test the get route "/users/:userId/parcels" ', function () {

  var param = '/api/v1/users/:userId/parcels';

  it('should respond with status 404 if user not found and return a "not found " message', function (done) {

    _chai2.default.request(_app2.default).get(param).end(function (err, res) {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.value.should.equal('not found');
    });
    done();
  });

  it('should return the parcels ordered by user if user id is found', function (done) {

    //randomly select an object/order from the array data above for querry test of userName
    var order = data[Math.floor(Math.random() * 5)];
    //querry the user name of the order/object gotten above to see if we get all orders made by the user
    _chai2.default.request(_app2.default).get('/api/v1/users/' + order.name + '/parcels').end(function (err, res) {
      //  console.log(res.body);
      console.log(order.name);
      res.should.have.status(200);
      res.should.be.a('object');
      //ensure that we get at least one parcel order since user is expected to be in database
      res.body.should.have.property('0');
    });
    done();
  });
});

//test the route for get parcels to return all orders in database/structure
describe("testing the route get 'api/parcels' ", function () {
  it('should be able to produce orders in the database ', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/parcels').end(function (err, res) {
      res.body.should.have.property("0");
      res.should.have.status(200);
      id = res.body[3].id;
      res.body.should.be.a('array');
      //test that all data returned are valid
      for (var i = 0; i < 5; i++) {
        res.body[i].should.have.property('id');
        res.body[i].should.have.property('name');
        //  console.log(res.body[i]);
      }
    });
    done();
  });
});

//test put route '/parcels/:parcelId/cancel'
describe('testing the put route api/parcels/:parcelId/cancel', function () {
  var param = '/api/v1/parcels/:parcelId/cancel';
  it('should return status 404 if parcelId not found and return a message "not found"', function (done) {
    _chai2.default.request(_app2.default).put(param).end(function (err, res) {
      res.should.have.status(404);
      res.body.value.should.equal('not found');
    });
    done();
  });
  it('should return deleted json showing that data is deleted from database if ID is found', function (done) {

    console.log('first ' + id);
    _chai2.default.request(_app2.default).put('/api/v1/parcels/' + id + '/cancel').end(function (err, res) {
      res.body.should.be.a('array');
      res.body[0].should.have.property('id');
      //console.log(res.body);
    });
    done();
  });
});