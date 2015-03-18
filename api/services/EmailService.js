//var api_key = 'key-7b54fbef79a56c2ec89e2a2bc241da1c';
var api_key = process.env.mailgun.key;
//var api_key = process.env.MAILGUNAPIKEY;
var domain = 'mail.ibu.io';
var mailgunjs = require('mailgun-js')({apiKey: api_key, domain: domain});
// var mailcomposer = new MailComposer();


// ibu mailing lists
var ibuApplicantsList = mailgunjs.lists('applicants@mail.ibu.io');	// should be @gogoexotic.com
var ibuClubsList      = mailgunjs.lists('clubs@mail.ibu.io');			// ``

// GogoExotic mailing lists
var gogoApplicantsList = mailgunjs.lists('applicants@mail.gogoexotic.com');	
var gogoClubsList      = mailgunjs.lists('clubs@mail.gogoexotic.com');

// iBu different senders
var fromIbuSupportName = 'iBu Suuport Team';
var fromIbuSupportAddr = 'support@ibu.io';
var fromIbuNoReplyName = 'iBu Team';
var fromIbuNoReplyAddr = 'noreply@ibu.io';

// GogoExotic different senders
var fromGogoSupportName = 'gogOeXotic Support Team';
var fromGogoSupportAddr = 'support@gogoexotic.com';
var fromGogoNoReplyName = 'gogOeXotic Team';
var fromGogoNoReplyAddr = 'noreply@gogoexotic.com';

var Mailgun = require('mailgun').Mailgun;
var mailgun = new Mailgun(api_key);

module.exports = {

	sendhtml: function (from, to, subject, html, cb) {
		var message = 'From: ' + from;
		message += '\nTo: ' + to;
		message += '\nContent-Type: text/html; charset=utf-8';
		message += '\nSubject: ' + subject;
		message += '\n\n' + html;

		mailgun.sendRaw(from, to, message, cb);
	},

	sendtext: function(fromAddr, fromName, to, subject, text, cb) {
		var data = {
  			from: fromName + ' <' + fromAddr + '>',
  			to: to,
  			subject: subject,
  			text: text
		};
 
		mailgunjs.messages().send(data, cb);
	},

	sendActivation: function (user) {
		if (typeof user.profile.contactEmail === 'undefined') {
			return false;
		}
		var html = '<a href=\'https://gogoexotic-core.herokuapp.com/gateway/activate?activation_key=' + user.activationKey + '\'>click here</a> to activate your account';
		var message = 'From: admin@ibu.io';
		message += '\nTo: ' + user.profile.contactEmail;
		message += '\nContent-Type: text/html; charset=utf-8';
		message += '\nSubject: GogoExotic Account Verification';
		message += '\n\n' + html;		

		mailgun.sendRaw('admin@ibu.io', user.profile.contactEmail, message, function () {});
	},

	// send invitation 
	sendinvite: function(hostId, invitedId, inviteDate) {
		User.findOne(hostId).then(function(fromUser) {
			User.findOne(invitedId).then(function(toUser) {
				if(typeof toUser.profile.email === 'undefined') {
					return false;
				}
				var htmlMessage = '<p> Hi, ' + fromUser.username + ' has invited you to work on ' + inviteDate + 
                            '. To answer contact at: ' + fromUser.profile.phone + ' or ' + fromUser.email + '. </p>';

                var textMessage = 'Hi, ' + fromUser.username + ' has invited you to work on ' + inviteDate + 
                            '. To answer contact at: ' + fromUser.profile.phone + ' or ' + fromUser.email + '.';

        		var data = {
        			from: fromGogoNoReplyName + fromGogoNoReplyAddr,
        			to: toUser.profile.email,
        			subject: 'Gogo New Invitation!',
        			text: textMessage
        		};

        		mailgun.messages().send(data, function (err, body) {
              // cb(err, message);
        		});
			})
		})
	},

	sendhtmltolist: function(from, to, subject, html, cb) {

	},

	sendtexttolist: function(from, to, subject, html, cb) {

	},

	// add a user to a specific mailing list
	addusertolist: function(username, useraddress, listname, cb) {
		var list = mailgunjs.lists(listname);

		var user = {
				subscribed: true,
			  	address: useraddress,
			  	name: username
			};


		list.info(function (err, data) {
		  // `data` is mailing list info 
		  console.log('Adding user ' + JSON.stringify(user) + ' to list: ');
		  console.log(data);
		});

		list.members().create(user, cb);
	},

	removeuserfromlist: function(user, list, cb) {

	},
}







