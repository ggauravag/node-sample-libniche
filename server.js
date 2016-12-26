/**
 * Created by Gaurav on 24-12-2016.
 */

process.on('uncaughtException', function (err) {
    console.log('uncaughtException caught the error', err, err.message, err.stack);
});

process.on('unhandledRejection', function (err, promise) {
    console.log('unhandledRejection caught the error', err, err.message, err.stack);
})

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');

// mongodb config
var db = require('./config/db');

// set our port
var port = process.env.PORT || 3000;

// mongodb connection establishment
mongoose.Promise = require('bluebird');
mongoose.connect(db.url);
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + db.url);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

app.use(session({
    resave: false,
    saveUninitialized: false,
    name: 'ng.sess.id',
    secret: 'secret'
}));

var auth = function(req, res, next) {
    if (req.session && req.session.user && req.session.user.username)
        return next();
    else
        return res.status(401).send({message: 'User is not authenticated'})
};

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// init db models
init_models();

global.ROOT_DIR = path.dirname(__filename);

// configure our routes
require('./app/routes')(app, auth);

// configure port of app and start it
app.listen(port, function () {
    console.log('%s: Node server started on http://%s:%d ...', Date(Date.now()), ('localhost'), port);
});

// expose app
exports = module.exports = app;

function init_models() {
    require('./app/models/book');
    require('./app/models/admin_user');
    require('./app/models/user');
    require('./app/models/transaction');
}
