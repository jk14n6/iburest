/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    /*
     *
     * APP SPECIFIC TASKS
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

    /*
     *
     * EMAILz
     *
     */
    sendtextemail: function(req, res) {
    	var to;
    	var fromAddress;
    	var fromName;
    	var subject;
    	var message;
    	if(req.param('to') !== 'undefined' && req.param('to') !== null)
    		to = req.param('to');
    	else
    		res.send(400);
    	if(req.param('fromaddress') !== 'undefined' && req.param('fromaddress') !== null)
    		fromAddress = req.param('fromaddress');
    	else
    		res.send(400);
    	if(req.param('fromname') !== 'undefined' && req.param('fromname') !== null)
    		fromName = req.param('fromname');
    	if(req.param('subject') !== 'undefined' && req.param('subject') !== null)
    		subject = req.param('subject');
    	if(req.param('message') !== 'undefined' && req.param('message') !== null)
    		message = req.param('message');
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

    addusertolist : function(req, res) {
    	var listName;
    	var subscriberName;
    	var subscriberAddr;
    	if(req.param('subscribername') !== 'undefined' && req.param('subscribername') !== null)
    		subscriberName = req.param('subscribername');
    	else
    		res.send(400);
    	if(req.param('subscriberaddr') !== 'undefined' && req.param('subscriberaddr') !== null)
    		subscriberAddr = req.param('subscriberaddr');
    	else
    		res.send(400);
    	if(req.param('listname') !== 'undefined' && req.param('listname') !== null)
    		listName = req.param('listname');
    	else
    		res.send(400);

    	EmailService.addusertolist(subscriberName, subscriberAddr, listName, function(err, data) {
    		if(!err) {
    			console.log('user was successfully added to mailing list!');
    			res.send(200);
    		}
    		else
    			res.send(400);
    	});


    },


    /*
     *
     * SMS 
     *
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

    sendBulkSms: function(req, res) {
    	var tos = req.param('tos');
    	var body = req.param('body');

    	//for (var key in tos)
    	//{
    	//   if (result.hasOwnProperty(key))
    	//   {
    	//      // here you have access to
    	//      var MNGR_NAME = result[key].MNGR_NAME;
    	//      var MGR_ID = result[key].MGR_ID;
    	//   }
    	//}
    },
};

