//var twilio = require('twilio')('ACfc6abc644bcdf94532df4e1be88aecae', 'c914be9076d53e2dfb7a545e3f64f350');
var twiliosid = process.env.twilio.sid;
var twiliokey = process.env.twilio.key;
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
        if(to !== undefined && body !== undefined) {
            // send sms
            twilio.sendSms({
                to: to,
                from: fromPhone,
                body: message
            }, cb);
        }
    }

    
};