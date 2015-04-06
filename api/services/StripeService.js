var stripekey = process.env.STRIPE_KEY_PRIVATE;
var stripe = require('stripe')(stripekey);

var Q = require('q');
var log = require('captains-log')();

module.exports = {

		subscribeToPlan: function(stripeToken, customerEmail, planId, userId) {
			log('Stripe token: ' + stripeToken);
			log('Customer email: ' + customerEmail);
			log('Plan ID: ' + planId);
			log('Internal user: ' + userId);


			// promises
			var deferred = Q.defer();

			// Create the customer and subscibe immediately to the plan
			stripe.customers.create({
					description: 'Customer ' + customerEmail + ' subscibes to plan ' + planId ,
					source: stripeToken,
					email: customerEmail,
					plan: planId,
			}, function(err, customer) {
				if (err && err.type === 'StripeCardError') {
					return deferred.reject(err);
				} 
				// log info
				log('Card has been processed for customer: ' + customer.id);

				// update user with new customer id
				User.update({ id: userId }, {stripeId : customer.id, hasAgreedTerms : true}).then(function (updatedUsers) {
					deferred.resolve(null);
				});
				// Send confirmation email
				
			});

			return deferred.promise;
		},
			
		/*
		 * Get a list of plans matching a prefix pattern
		 */
		getPlans: function(prefixPlan) {
			// promises
			var deferred = Q.defer();

			// call to Stripe API
			stripe.plans.list(function(err, plans) {
				if (err) {
					return deferred.reject(err);
				}
			  var listOfPlans = [];

			  // loop on result to extract only corresponding plans
			  plans.data.forEach(function(plan) {
			  	if(plan.id.length >= prefixPlan.length && plan.id.substring(0, prefixPlan.length) === prefixPlan) {
			  		listOfPlans.push(plan);
			  	}
			  });
			  deferred.resolve(listOfPlans);
			  log('Fetched list of plans: ' + JSON.stringify(listOfPlans, null, 2));
			});
			return deferred.promise;
		}

			

		
	};