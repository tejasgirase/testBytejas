var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config.json');
var session = require('express-session');
var expressJwt = require('express-jwt');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('../client/app'));

app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// Use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/account/authenticate', '/api/account/getToken','/api/account/forgotPassword'] }));

app.use('/api/account', require('./controllers/account.controller'));
app.use('/api/dashboard', require('./controllers/dashboard.controller'));

//Start Server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});