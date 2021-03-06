var twiliosid = process.env.TWILIO_SID;
var twiliokey = process.env.TWILIO_KEY;
sails.log.info('twiliosid: ' + twiliosid);
var twilio = require('twilio')(twiliosid, twiliokey);

var fromPhone = '+14387950258';

var Q = require('q');

module.exports = {

    invite: function(hostId, invitedId, smsbody, inviteDate, cb) {
        var hostUser;
        var invitedUser;
        var body;

        User.findOne(hostId).then(function(fromUser) {

                User.findOne(invitedId).then(function(toUser) {
                    body = 'Hi, ' + fromUser.username + ' has invited you to work on ' + inviteDate + 
                            '. To answer contact at: ' + fromUser.profile.phone + ' or ' + fromUser.email + '. ';

                    if(smsbody !== 'undefined') {
                        body = body + smsbody;
                    }

                    // send sms
                    twilio.sendMessage({
                        to: toUser.profile.phone,
                        from: fromPhone,
                        body: body
                    }, cb);
                });
        });
    },

    // basic send
    send: function(toPhone, message, cb) {
        if(toPhone !== undefined && message !== undefined) {
            // send sms
            twilio.sendSms({
                to: toPhone,
                from: fromPhone,
                body: message
            }, cb);
        }
    }

    
};