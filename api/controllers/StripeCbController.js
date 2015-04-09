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

		var authCode = req.param('code');					// used to make a POST request to Stripe access_token_url endpoint
		var scope = req.param('scope');						// dictates what iBu platform will be able to do on behalf of the connected account
		var stripeErr = req.param('error');					// Stripe error name, if any
		var StripeErrDesc = req.param('error_description'); // stripe error description

		log('code: '  + authCode);
		log('scope: ' + scope);

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
		    		client_id: process.env.STRIPE_CLIENT_ID,
		    		code : authCode,
		    		grant_type : 'authorization_code',
		    		client_secret : process.env.STRIPE_KEY_PRIVATE
	    		} 
    		},
		    function (error, response, body) {
		        if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
		            log(JSON.stringify(body, null, 2));

		            // create a new StripeAccount data object in DB to be able to retrive info
		            StripeAccount.create({
							company_name           : 'GogoExotic',
							fee_percent            : 25,
							token_type             : JSON.parse(body).token_type,
							stripe_publishable_key : JSON.parse(body).stripe_publishable_key,
							scope                  : JSON.parse(body).scope,
							livemode               : JSON.parse(body).livemode,
							stripe_user_id         : JSON.parse(body).stripe_user_id,
							refresh_token          : JSON.parse(body).refresh_token,
							access_token           : JSON.parse(body).access_token
						}).exec(function createCB(err, created) {
		            	log('Created Stripe Account: ' + JSON.stringify(created, null, 2));
		            });
		        }
		        else if(error) {
		        	log(JSON.stringify(error, null, 2));
		        }
		    }
		);

		res.send('OK');
	}
};