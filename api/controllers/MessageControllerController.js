/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    /*
     *
     * EMAIL
     *
     */
	invite: function(req, res) {

        var date = req.param('date');
        var body = req.param('text') || '';
        var hostId = req.user; // celui qui invite
        var invitedId = req.param('invited');

        // send sms invite
        SmsService.invite(hostId, invitedId, body, date, function(err, message) {
    		if(!err) {
	            // logging
	            console.log('Success! The SID for this SMS message is:');
	            console.log(message.sid);
	            console.log('Message sent on:');
	            console.log(message.dateCreated);

	            //EmailService.invite(hostId, invitedId, date);
                res.send(200);
           //          res.send(200);
	          // //   	if(!err) {
	          // //   		res.send(200);
	          // //   	}
	        		// // else {
	        		// // 	res.send(400);
        			// // }
	          //   });

	        }
	        else {
                res.send(400);
            }
        });
    },

    sendEmail: function(req, res) {
    	var to = req.param('to');
		var message = req.param('message');

    	EmailService.send(to, message);
    },

    sendtextemail: function(req, res) {
    	var to = req.param('to');
    	var fromAddress = req.param('fromaddress');
    	var fromName = req.param('fromname');
    	var subject = req.param('subject');
    	var message = req.param('message');

    	EmailService.sendtext(fromAddress, fromName, to, subject, message, function (err, message) {
    		if(!err) {
    			console.log('message sent successfully!');
    			res.send(200);
    		}
    		else
    			res.send(400);
    	});
    },

    /*
     * SMS 
     */
    // simple sms sending
    sendSms: function(req, res) {
    	var to = req.param('to');
    	var body = req.param('body');

    	SmsService.send(to, body, function(err, message) {
    		if(!err) {
    			//logging
	            console.log('Success! The SID for this SMS message is:');
	            console.log(message.sid);
	            console.log('Message sent on:');
	            console.log(message.dateCreated);

	            res.send(200);
    		}
    		else
    			res.send(400);
    	})
    },

    /*
     * This rest service will only be called by twilio when a user
     * wants to confirm it's phone number by replying to the sms
     * the application has sent him. 
     * Please do not alter.
     */
    twiliocbconfirmnumber : function(req, res) {
        var messageSid 	= req.param('MessageSid');
        var accountSid 	= req.param('AccountSid');
        var from 		= req.param('From');
        var to 			= req.param('To');
        var body 		= req.param('Body');
        var fromCity 	= req.param('FromCity');
        var fromZip 	= req.param('FromZip');
        var fromCountry	= req.param('FromCountry');

        //if(body.toUpperCase() === 'YES')
        	console.log('User with phone number [' + from + '] has confirmed it\'s number via sms');
        	//fromAddr, fromName, to, subject, text
        	EmailService.sendtext('toto@toto.com', 'j0k', 'klang.jonathan@gmail.com', 'sms confirmation', body);
    }
};

