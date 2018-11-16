'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = undefined;

var _db = require('../model/db.js');

var express = require('express');
var route = express.Router();

var dat = (0, _db.x)();
var i = 1;

//cross origin resource sharing

/*  route.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

route.get('/', function (req, res) {
  var message = {
    value: 'welcome to Gilberts API. nav to "/parcels " for all orders, post ur order to "/parcels", get all orders by a user from "/users/userName/parcels", cancel order from "/parcels/parcelID/cancel" and get specific parcel with "/parcel/parcelsID" '
  };
  res.status('200').json(message.value);
});

route.get('/parcels', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  res.status('200').json(dat);
});

route.get('/parcels/:parcelsId', function (req, res) {
  var index = 0;
  var requiredIndex = 'unmatched';
  dat.forEach(function (x) {
    if (req.params.parcelsId == x.id) {
      requiredIndex = index;
    }
    index++;
  });
  if (requiredIndex === 'unmatched') {
    var message = {
      value: 'not found'
    };
    res.status('404').send(message);
  } else {

    res.status('200').json(dat[requiredIndex]);
  }
});

route.get('/users/:userId/parcels', function (req, res) {
  var tempData = [];
  var found = 'no';
  dat.forEach(function (x) {
    if (x.name == req.params.userId) {
      tempData.push(x);
      found = 'yes';
    }
  });
  if (found === 'yes') {
    res.status('200').send(tempData);
  } else {
    var message = {
      value: 'not found'
    };
    res.status('404').send(message);
  }
});

route.put('/parcels/:parcelId/cancel', function (req, res) {
  var index = 0;
  var cancelIndex = 'unmatched';
  dat.forEach(function (x) {
    if (req.params.parcelId == x.id) {
      cancelIndex = index;
    }
    index++;
  });
  if (cancelIndex === 'unmatched') {
    var message = {
      value: 'not found'
    };
    res.status('404').send(message);
  } else {
    var tempdata = [];
    tempdata.push(dat[cancelIndex]);
    dat.splice(cancelIndex, 1);
    res.status('200').json(tempdata);
  }
});

route.post('/parcels', function (req, res) {

  var x = req.body;
  x.id = Math.floor(Math.random() * 10000000 + i);
  dat.push(x);
  i++;
  res.status('201').json(req.body);
});

exports.route = route;