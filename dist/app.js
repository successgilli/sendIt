'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require('./routes/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.use(_bodyParser2.default.json());

app.use('/api/v1', _api.route);

module.exports = app.listen(process.env.PORT || 8080, function () {
  console.log('we are on port 8080');
});