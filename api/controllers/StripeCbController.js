/**
 * StripeCbController
 *
 * @description :: Server-side logic for managing Stripe callbacks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * @Stripe doc  :: https://stripe.com/docs
 */
var request = require('request');
var log 	= require('captains-log')();

module.exports = {

	/*
	 * This is called by Stripe when a business app owner created it's account
	 * to be able to accept payments with stripe via ibu platform.
	 * see: https://stripe.com/docs/connect for more info
	 */
	accountAuthorize : function(req, res) {
		log(req.param('code'));
		log(req.param('scope'));

		var authCode = req.param('code');					// used to make a POST request to Stripe access_token_url endpoint
		var scope = req.param('scope');						// dictates what iBu platform will be able to do on behalf of the connected account
		var stripeErr = req.param('error');					// Stripe error name, if any
		var StripeErrDesc = req.param('error_description'); // stripe error description

		// get the user id
		//var user = ...
		var userid = 1; // hardcoded for now

		// get the authentication credentials for the new user by making a POST to stripe endpoint
		// reponse will be like:
		/*
		*	{
		*	  "token_type": "bearer",
		*	  "stripe_publishable_key": PUBLISHABLE_KEY,
		*	  "scope": "read_write",
		*	  "livemode": false,
		*	  "stripe_user_id": USER_ID,
		*	  "refresh_token": REFRESH_TOKEN,
		*	  "access_token": ACCESS_TOKEN
		*	}
		*
		*   if error:
		*   {
  		*	  "error": "invalid_grant",
  		*	  "error_description": "Authorization code does not exist: AUTHORIZATION_CODE"
		*	}
		*/
		request.post('https://connect.stripe.com/oauth/token',
		    { form: { 
		    		client_secret: process.env.STRIPE_CLIENT_ID,
		    		code : authCode,
		    		grant_type : 'authorization_code'
	    		} 
    		},
		    function (error, response, body) {
		        if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
		            log(body);

		            // update user/app infos set stripe profile
		            var user = User.findOne(userid).done(function(error, user) {
		                if(error) {
		                    // do something with the error.
		                }

		                user.stripeAccount = body;

		                user.save(function(error) {
		                    if(error) {
		                        // do something with the error.
		                    } else {
		                        // value saved!
		                        req.send(user);
		                    }
		                });
		            });
		        }
		        else if(error) {
		        	log()
		        }
		    }
		);

		res.send('OK');
	}
};