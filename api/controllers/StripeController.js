/**
 * StripeController
 *
 * @description :: Server-side logic for managing stripes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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

		listOfPlans = StripeService.getPlans('gogo_');
		//if()
		log(listOfPlans);
	}
};

