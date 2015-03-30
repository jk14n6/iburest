/**
 * StripeCbController
 *
 * @description :: Server-side logic for managing Stripecbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');

module.exports = {

	/*
	 * This is called by Stripe when a business app owner created it's account
	 * to be able to charge via ibu platform.
	 * see: https://stripe.com/docs/connect/standalone-accounts for more info
	 */
	accountAuthorize : function(req, res) {
		console.log(req.param('code'));
		console.log(req.param('scope'));

		// get the authentication credentials for the new user
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
		    		client_secret: process.env.STRIPE_KEY_PRIVATE,
		    		code : req.param('code'),
		    		grant_type : 'authorization_code'
	    		} 
    		},
		    function (error, response, body) {
		        if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
		            console.log(body);

		            // persist returned info into user's stripe profile
		            
		        }
		    }
		);

		res.send('OK');
	}
};

