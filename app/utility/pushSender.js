'use strict';

const PushConfig = require('../model/PushConfig');
const agSender = require('unifiedpush-node-sender');
const winston = require('winston');
require('winston-loggly-bulk');

var getLeadMessage = (lead) => {
    return {
        alert: 'A new lead has been created',
        sound: 'default',
        userData: {
            id: lead.id,
            messageType: 'pushed_lead',
            name: lead.name,
            location: lead.location,
            phone: lead.phoneNumber
        }
    }
}

var newLeadOptions = {
    criteria: {
        categories: ['lead'],
        alias: []
    },
    config: {
        ttl: 3600
    }
};

var settings = {
    url: '',
    applicationId: '',
    masterSecret: ''
};

var sendPush = (pushMessage, pushOptions, settings, requestId) => {
    winston.info('sendPush function: request recieved to send push - ' + requestId);
    winston.info('sendPush function: Sending push message: - ' + JSON.stringify(pushMessage));
    return agSender(settings)
        .then((client) => {
            return client.sender.send(pushMessage, pushOptions);
        }).then((response) => {
            return response;
        })
};

exports.sendLeads = (aliases, lead, requestId) => {
    winston.info('sendLeads function: request recieved to send lead - ' + requestId);
    return PushConfig.findOne({ active: true })
        .then(activePushConfig => {
            winston.info('sendLeads function: retrieving activePushConfig - ' + requestId);
            if (activePushConfig != null) {
                settings.url = activePushConfig.serverURL;
                settings.applicationId = activePushConfig.pushApplicationId;
                settings.masterSecret = activePushConfig.masterSecret;
                newLeadOptions.criteria.alias = aliases;
                return sendPush(getLeadMessage(lead), newLeadOptions, settings, requestId);
            }
        })
};

var getAcceptedLeadMessage = (lead) => {
  return  {
        alert: 'A new lead has been accepted',
        sound: 'default',
        userData: {
            id: lead.id,
            messageType: 'accepted_lead',
            name: lead.name,
            location: lead.location,
            phone: lead.phone
        }
    }
}

var acceptedLeadOptions = {
    config: {
        ttl: 3600
    }
};

exports.sendBroadcast = (lead, requestId) => {
 winston.info('sendBroadcast function: request recieved to send broadcast- ' + requestId);
  return PushConfig.findOne({ active: true })
        .then(activePushConfig => {
            winston.info('sendBroadcast function: retrieving activePushConfig - ' + requestId);
            if (activePushConfig != null) {
                settings.url = activePushConfig.serverURL;
                settings.applicationId = activePushConfig.pushApplicationId;
                settings.masterSecret = activePushConfig.masterSecret;
                return sendPush(getAcceptedLeadMessage(lead), acceptedLeadOptions, settings, requestId);
            }
        })
};
