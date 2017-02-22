'use strict';

const express = require('express');
const app = express();
const routes = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('mongoose-double')(mongoose);
mongoose.Promise = global.Promise;
const config = require('./config/config');
var requestId = require('request-id/express');

app.use(requestId());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

// fulfils pre-flight/promise request
app.options('*', function(req, res) {
    res.sendStatus(200);
});

(function init() {
    var db;
    var port;

    if (process.env.NODE_ENV === 'test') {
        port = 5555;
        db = config.test;
    } else {
        port = process.env.SERVER_PORT || 8080;
        db = process.env.MONGO_URL || config.database;
    }

    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    });

    mongoose.connect(db, { server: { auto_reconnect: true } }, function(err) {
        if (err) {
            console.log("Error ", err);
        } else {
            console.log('Connected to database');
        }
    });

})();

var api = require('./routes');
app.use('/aerodoc/rest', api);

module.exports = app;
