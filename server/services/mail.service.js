var nodemailer = require('nodemailer');
var Q = require('q');
var appConfig = require('../../appConfig');

var service = {};
service.sendForgotPasswordUser = sendForgotPasswordUser;
module.exports = service;
function sendForgotPasswordUser(userInfo) {
	var deferred = Q.defer();
	var smtpConfig = {
	    host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
	    auth: {
	        user: appConfig.SUPER_ADMIN_EMAIL,
	        pass: appConfig.SUPER_ADMIN_PASSWORD
	    }
	};
		
	// Mail body for company user confirmation mail
	var mailOptions = {
		from: appConfig.SUPER_ADMIN_EMAIL,
		to: userInfo.email,
		subject : "Set Password Link",
		html : "<b>Hello,</b><br><br> You new password is <b>" + userInfo.newPassword + " </b> company. Please login with new password on the link to set password.</b>"
	};
	var transporter = nodemailer.createTransport(smtpConfig);

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return deferred.reject(error);
	    }
	    deferred.resolve({
	    	"success":true,
	    	"message":'Message sent: ' + info.response,
	    	"data":{
	    		"generatedEmailVerifyToken": generatedEmailVerifyToken
	    	}
	    });
	});
	return deferred.promise;
}