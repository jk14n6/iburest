/**
 * StripeCbController
 *
 * @description :: Server-side logic for managing Stripecbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');

module.exports = {
	connectUserCb : function(req, res) {
		console.log(req.param('code'));
		console.log(req.param('scope'));

		request.post('https://connect.stripe.com/oauth/token',
		    { form: { 
		    		client_secret: process.env.STRIPE_KEY_PRIVATE,
		    		code : req.param('code'),
		    		grant_type : 'authorization_code'
	    		} 
    		},
		    function (error, response, body) {
		        if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
		            console.log(body)
		        }
		    }
		);

		res.send('OK');
	}
};

