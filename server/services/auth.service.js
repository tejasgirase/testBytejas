var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/meanStack';
var Q = require('q');
var jwt = require('jsonwebtoken');
var config = require('../config.json');
// var mailSerice = require('./mail.service');

var service = {};
service.authenticate = authenticate;
service.forgotPassword = forgotPassword;

module.exports = service;

function authenticate(Email, Password) {
    var deferred = Q.defer();
    MongoClient.connect(url, function (err, db) {
        if (err)
            console.log('Unable to connect to MongoDB Server. Error:', err);

        var collection = db.collection('login');
        collection.findOne({ email: Email, newPassword: Password }, function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                    var userId = convertIntoObjectId(user._id);
                    if (userId.Error) {
                        deferred.reject(userId.Error);
                        return deferred.promise;
                    }
                    var userObject = {
                        "password":Password,
                        "changePasswordHasToBeShown":false
                    };
                    collection.update({'_id':userId},{$set:userObject},{safe:true},function(err,user) {
                        if(err) deferred.reject(err);
                        if(user){
                            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
                        }
                    });
                }
            else {
                collection.findOne({ email: Email, password: Password }, function (err, user) {
                    if (err) deferred.reject(err);
                    if(user){
                        deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
                    }else{
                        deferred.resolve();
                    }
                });
                
            }
        });
    });
    return deferred.promise;
    db.close();
}


function forgotPassword(Email) {
    var deferred = Q.defer();
    MongoClient.connect(url, function (err, db) {
        if (err)
            console.log('Unable to connect to MongoDB Server. Error:', err);

        var collection = db.collection('login');
        collection.findOne({ email: Email}, function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                    var randomPassword = generatePassword();
                    var userId = convertIntoObjectId(user._id);
                    if (userId.Error) {
                        deferred.reject(userId.Error);
                        return deferred.promise;
                    }
                    var userObject = {
                        "newPassword":randomPassword,
                        "changePasswordHasToBeShown":true
                    };
                    collection.update({'_id':userId},{$set:userObject},{safe:true},function(err,user) {
                        if(err) deferred.reject(err);
                        if(user){
                            var newPasswordObj = {
                                "newPassword":randomPassword,
                                "changePasswordHasToBeShown":true
                            };
                            // var send = mailSerice.sendForgotPasswordUser(newPasswordObj);
                            deferred.resolve(newPasswordObj);
                        }
                    });
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


function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function convertIntoObjectId(id) {
	var convertedIdIntoString = id.toString();
	if(convertedIdIntoString.length === 12 || convertedIdIntoString.length === 24){
		var convertedObjId = mongodb.ObjectId(id);
		return convertedObjId;
	}
	else{
		return {"Error":"MongoDB ObjectId conversion error : Passed argument is must be a single String of 12 bytes or a String of 24 hex characters at new ObjectID"};
	}
}