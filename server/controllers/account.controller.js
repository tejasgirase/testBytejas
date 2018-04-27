
var express = require('express');
var router = express.Router();
var authService = require('../services/auth.service');
var mailSerice = require('../services/mail.service');

// Routes
router.post('/authenticate', authenticateUser);
router.get('/getToken', getToken);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);

module.exports = router;

function authenticateUser(req, res) {
    authService.authenticate(req.body.email, req.body.password).then(function (token) {
        if (token) {
            // Save JWT token in the session to make it available to the angular app
            req.session.token = token;            

            // Authentication successful
            res.send({ token: token });
        }
        else {
            // Authentication failed
            // res.sendStatus(401);
            res.send('Entered username and/or password is wrong. Please try again.');
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

function forgotPassword(req, res) {
    console.log(req.body.email);
    authService.forgotPassword(req.body.email).then(function (token) {
        if (token) {
            // Save JWT token in the session to make it available to the angular app
            
            // Authentication successful
            mailSerice.sendForgotPasswordUser(token).then(function(emailResp){
                if(emailResp) {
                    console.log(emailResp)
                    res.send({ data: emailResp});
                }
                else {
                    res.send('Email not sent. Please try again.');
                }
            }).catch(function(){
                res.status(400).send(err);        
            });
        }
        else {
            // Authentication failed
            // res.sendStatus(401);
            res.send('Entered Email is wrong. Please try again.');
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

// Make JWT token available to angular app
function getToken(req, res) {
    res.send(req.session.token);
}

function logout(req, res) {
    // req.session.token = "";    
    delete req.session.token;
    if (req.session.token == undefined)
        res.sendStatus(200);
    // res.send(req.session.token);
}