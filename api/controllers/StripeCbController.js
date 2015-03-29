/**
 * StripeCbController
 *
 * @description :: Server-side logic for managing Stripecbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	connectUserCb : function(req, res) {
		console.log(req.param('response_type'));
		console.log(req.param('client_id'));
		console.log(req.param('scope'));

		res.send('OK');
	}
};

