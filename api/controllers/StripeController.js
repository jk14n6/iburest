/**
 * StripeController
 *
 * @description :: Server-side logic for managing stripes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * @author      :: j0n k.
 */


var log = require('captains-log')();
var stripekey = process.env.STRIPE_KEY_PRIVATE;
var stripe = require('stripe')(stripekey);
 /*
  * STRIPE ERROR TYPES AND ERROR CODES:
	TYPES
		invalid_request_error	Invalid request errors arise when your request has invalid parameters.
		api_error	API errors cover any other type of problem (e.g. a temporary problem with Stripe's servers) and should turn up only very infrequently.
		card_error	Card errors are the most common type of error you should expect to handle. They result when the user enters a card that can't be charged for some reason.
  	CODES
		incorrect_number	The card number is incorrect.
		invalid_number	The card number is not a valid credit card number.
		invalid_expiry_month	The card's expiration month is invalid.
		invalid_expiry_year	The card's expiration year is invalid.
		invalid_cvc	The card's security code is invalid.
		expired_card	The card has expired.
		incorrect_cvc	The card's security code is incorrect.
		incorrect_zip	The card's zip code failed validation.
		card_declined	The card was declined.
		missing	There is no card on a customer that is being charged.
		processing_error	An error occurred while processing the card.
		rate_limit	An error occurred due to requests hitting the API too quickly. Please let us know if you're consistently running into this error.

	Example:
		// An error from the Stripe API or an otheriwse asynchronous error
		// will be available as the first argument of any Stripe method's callback:
		// E.g. stripe.customers.create({...}, function(err, result) {});
		//
		// Or in the form of a rejected promise.
		// E.g. stripe.customers.create({...}).then(
		//        function(result) {},
		//        function(err) {}
		//      );

		switch (err.type) {
		  case 'StripeCardError':
		    // A declined card error
		    err.message; // => e.g. "Your card's expiration year is invalid."
		    break;
		  case 'StripeInvalidRequestError':
		    // Invalid parameters were supplied to Stripe's API
		    break;
		  case 'StripeAPIError':
		    // An error occurred internally with Stripe's API
		    break;
		  case 'StripeConnectionError':
		    // Some kind of error occurred during the HTTPS communication
		    break;
		  case 'StripeAuthenticationError':
		    // You probably used an incorrect API key
		    break;
		}
  */

module.exports = {

	/* 
	 * Get a list of all plans (here all plans starting with string 'gogo_')
	 */
	getPlans : function(req, res) {
		var listOfPlans = [];

		StripeService.getPlans('gogo_')
		.then(function(listOfPlans) {
			log(JSON.stringify(listOfPlans, null, 2));
		}, function(error) {
			log(error);
		});
	},

	createCustomer : function(req, res) {
		var desc     = req.param('description');
		var courriel = req.param('email');

		stripe.customers.create({
		  description : desc,
		  email       : courriel
		}, function(err, customer) {
			if(!err) {
		  		log('Created Customer' + JSON.stringify(customer, null, 2));
		  		res.send(customer);
		 	}
		 	else {
		 		log('ERROR: ' + error);
		 	}
		});
	},

	/*
	 * Create a Stripe credit card to be associated to a Stripe Customer
	 */
	createCard : function(req, res) {
		var customerId = req.param('customerid');
		var cardNumber = req.param('cardnumber');
		var expMonth   = req.param('expmonth');
		var expYear    = req.param('expyear');
		var cardcvc    = req.param('cvc');
		var name       = req.param('name');


		stripe.customers.createSource(
		  customerId,
		  {
		  	source: 
		  	{
			  	object : 'card',
			  	number : cardNumber,
			  	exp_month : expMonth,
			  	exp_year  : expYear,
			  	cvc       : cardcvc
		  	}
		  },
		  function(err, card) {
			if(!err) {
		    	log('Created Card: ' + JSON.stringify(card, null, 2));
		    	res.send(card);
		    }
		 	else {
		 		log('ERROR: ' + error);
		 	}
		  }
		);
	}
};

