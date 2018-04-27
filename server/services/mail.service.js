var nodemailer = require('nodemailer');
var Q = require('q');

var service = {};
service.sendForgotPasswordUser = sendForgotPasswordUser;
module.exports = service;
function sendForgotPasswordUser(userInfo) {
	var deferred = Q.defer();
	var smtpConfig = {
		host: 'smtp.ethereal.email',
	    port: 587,
	    // secure: true, // use SSL
	    auth: {
	        user: 'ir73calvzj3lr6xz@ethereal.email',
	        pass: 'sY65EuHBzcs3rmeSSx'
	    }
	};
	// Mail body for company user confirmation mail
	var mailOptions = {
		from: "tejas.girase@tops-int.com",
		to: userInfo.email,
		subject : "Set Password Link",
		html : "<b>Hello,</b><br><br> You new password is <b>" + userInfo.newPassword + " </b> company. Please login with new password on the link to set password.</b>"
	};
	var transporter = nodemailer.createTransport(smtpConfig);
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
			console.log("called");
	        return deferred.reject(error);
		}
		console.log("called");
	    deferred.resolve({
	    	"success":true,
	    	"message":'Message sent: ' + info.response
	    });
	});
	return deferred.promise;
}