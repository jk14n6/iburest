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
	 * All those functions are made for a Club to be able to pay it's dues.
	 * The payments are made via ibu's Stripe account and are destined to gogo.
	 * ibu will take a fee on each payments.
	 * Here are the steps to be able to charge a club:
	 * 		1. 	GogoExotic has to create a 'connect' account by filling a form on Stripe
	 *			site.
	 *		2.	The Club has to fill a form in order to create a 'Customer' entity in ibu's
	 *			Strip account. After submiting the form, a Customer and a Card will be created
	 *			and available for ibu to start charging.
	 *		3.	Once a Club is created and it's Stripe corresponding 'Customer' created, we subscribe
	 *			it to a dummy plan (0$/month) in order to be able to charge him some invoices every
	 *			'x' days.
	 *		4.	Whenever a Club uses the service, we create an invoice that will be added to a list 
	 *			of pending invoices. At the end of the month, all invoices will be charged and only
	 *			at that moment ibu will get a fee% from the total amount from the invoices and gogo
	 *			will get the rest.
	 */

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

	/*
	 * Subscribe to the 0$ plan (which is used for 
	 * getting all the invoices of the payment period)
    */
    subscribeToPlan : function(req, res) {
        var planId     = req.param('planid');
        var customerId = req.param('customerid');

        stripe.customers.createSubscription(
            customerId,
            {plan: planId},
            function(err, subscription) {
                if(!err) {
                    log('Customer ' + customerId + ' subscribed to plan ' + planId);
                }
                else {
                    log('ERROR: ' + error);
                }
            }
            );

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

            // ideally the returned customer id should be added to the club's profile so we can retrieve it easilly
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
    },

	/*
	 * Creates a Stripe 'Invoice Item' which will be added to the gogo_auto 
	 * subscription of the cutomer.
	 * This only applies for the clubs.
	 */
    createInvoiceItem : function(req, res) {
      var customerId = req.param('customerid');
		var totalAmount = req.param('amount');     //process.env.CHARGE_CLUB_01;
		var currency   = 'CAD';
		var desc       = req.param('description');

		// get customer's array of subsciptions and get the id of the gogo_auto subsciption
		stripe.customers.retrieve(customerId, function(err, customer) {
            if(!err) {
                if(customer.subscriptions !== null && typeof customer.subscriptions !== 'undefined') {
                    var arrSubscriptions = customer.subscriptions;//JSON.parse(customer.subscriptions);

                    log('customer.subscriptions: ' + JSON.stringify(customer.subscriptions, null, 2);
                    log('arrSubscriptions: ' + JSON.stringify(arrSubscriptions, null, 2);

                    arrSubscriptions.forEach(function (subsc) {
                        if(subsc.plan.id === 'gogo_auto') {

                            stripe.invoiceItems.create({
                                customer: customerId,
                                amount: totalAmount,
                                currency: "cad",
                                description: desc,
                                subscription: subsc.id
                            }, function(err, invoiceItem) {
                                log('Created Invoice Item: ' + JSON.stringify(invoiceItem, null, 2));
                            });
                        }
                    });
                }
            }
        });
	},

	/*
	 * Create a Stripe charge for a certain customer.
	 * This type of charge does not require any client form to be filled and 
	 * thus no stripe token is needed. It's a static charge that is done when
	 * goGo wants to charge a club, for example.
	 * 
	 * CHARGE_CLUB_01 has to be defined as an env variable to define the amount to charge
	 */
    createCharge : function(req, res) {

    }
};

