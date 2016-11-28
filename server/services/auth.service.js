var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/mean-stack';
var Q = require('q');
var jwt = require('jsonwebtoken');
var config = require('../config.json');

var service = {};
service.authenticate = authenticate;

module.exports = service;

function authenticate(Username, Password) {
    var deferred = Q.defer();
    MongoClient.connect(url, function (err, db) {
        if (err)
            console.log('Unable to connect to MongoDB Server. Error:', err);

        var collection = db.collection('login');
        collection.findOne({ username: Username, password: Password }, function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                // Authentication successful
                //var token = jwt.sign({sub:user._id},config.secret);
                //console.log(token);
                //deferred.resolve('Matched User..!');
                deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
            }
            else {
                // Authentication failed
                deferred.resolve();
            }
        });
    });
    return deferred.promise;
    db.close();
}