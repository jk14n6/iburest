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
    	if(req.param('to') !== 'undefined' && req.param('to') !== null)
    		var to = req.param('to');
    	// field is mandatory so bad request if not specified
    	else
    		res.send(400);
    	if(req.param('fromaddress') !== 'undefined' && req.param('fromaddress') !== null)
    		var fromAddress = req.param('fromaddress');
    	// field is mandatory so bad request if not specified
    	else
    		res.send(400);
    	if(req.param('fromname') !== 'undefined' && req.param('fromname') !== null)
    		var fromName = req.param('fromname');
    	if(req.param('subject') !== 'undefined' && req.param('subject') !== null)
    		var subject = req.param('subject');
    	if(req.param('message') !== 'undefined' && req.param('message') !== null)
    		var message = req.param('message');
    	// field is mandatory so bad request if not specified
    	else
    		res.send(400);

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
};

