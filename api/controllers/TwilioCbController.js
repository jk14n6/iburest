/**
 * TwilioController
 *
 * @description :: Server-side logic for managing twilio call backs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	

    /*
     * This rest service will only be called by twilio when a user
     * wants to confirm it's phone number by replying to the sms
     * the application has sent him. 
     * Please do not alter.
     */
    confirmnumber : function(req, res) {
        var messageSid 	= req.param('MessageSid');
        var accountSid 	= req.param('AccountSid');
        var from 		= req.param('From');
        var to 			= req.param('To');
        var body 		= req.param('Body');
        var fromCity 	= req.param('FromCity');
        var fromZip 	= req.param('FromZip');
        var fromCountry	= req.param('FromCountry');

        // maybe check for correct string sent by user or just wait for any answer
        //if(body.toUpperCase() === 'YES')
        	console.log('User with phone number [' + from + '] has confirmed it\'s number via sms');

            // ADD USER PHONE CONFIRMED IN DB
            // TODO
    }
};

