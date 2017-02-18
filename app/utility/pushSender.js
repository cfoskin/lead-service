'use strict';

const PushConfig = require('../model/PushConfig');
const agSender = require('unifiedpush-node-sender'); 
const winston = require('winston');
const mdk_express = require('datawire_mdk_express');
const mdk_winston = require('datawire_mdk_winston');
// Route Winston logging to the MDK:
const options = {
    mdk: mdk_express.mdk,
    name: 'lead-service/pushSender'
}
winston.add(mdk_winston.MDKTransport, options);


const newLeadMessage = {
    alert: 'A new lead has been created',
    sound: 'default',
    userData: {
        id: 'l',
        messageType: 'pushed_lead',
        name: '',
        location: '',
        phone: ''
    }
};

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

var sendPush = (pushMessage, pushOptions, settings) => {
    winston.info('Received request to send push message:' + JSON.stringify(pushMessage) );
    agSender(settings)
        .then((client) => {
            return client.sender.send(pushMessage, pushOptions);
        })
        .then((res) => {
            res.status(202);
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(500).json({
                message: 'failed to send push',
                error: err
            });
        });
};

exports.sendLeads = (aliases, lead) => {
    winston.info('Received request to send lead to aliases' + JSON.stringify(aliases));
    PushConfig.findOne({ active: true })
        .then(activePushConfig => {
            if (activePushConfig != null) {
                settings.url = activePushConfig.serverURL;
                settings.applicationId = activePushConfig.pushApplicationId;
                settings.masterSecret = activePushConfig.masterSecret;
                newLeadOptions.criteria.alias = aliases;
                newLeadMessage.userData.id = lead.id;
                newLeadMessage.userData.name = lead.name;
                newLeadMessage.userData.location = lead.location;
                newLeadMessage.userData.phone = lead.phoneNumber;
                sendPush(newLeadMessage, newLeadOptions, settings);
            }
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(404).json({
                message: 'error finding active push config',
                error: err
            });
        })
};

const acceptedLeadmessage = {
    alert: 'A new lead has been accepted',
    sound: 'default',
    userData: {
        id: '',
        messageType: 'accepted_lead',
        name: '',
        location: '',
        phone: ''
    }
};

var acceptedLeadOptions = {
    config: {
        ttl: 3600
    }
};

exports.sendBroadcast = (lead) => {
    winston.info('Received request to send push broadcase for lead:' + JSON.stringify(lead));
    PushConfig.findOne({ active: true })
        .then(activePushConfig => {
            if (activePushConfig != null) {
                settings.url = activePushConfig.serverURL;
                settings.applicationId = activePushConfig.pushApplicationId;
                settings.masterSecret = activePushConfig.masterSecret;
                acceptedLeadmessage.userData.id = lead.id;
                acceptedLeadmessage.userData.name = lead.name;
                acceptedLeadmessage.userData.location = lead.location;
                acceptedLeadmessage.userData.phone = lead.phoneNumber;
                sendPush(acceptedLeadmessage, acceptedLeadOptions, settings);
            }
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(404).json({
                message: 'error finding active push config',
                error: err
            });
        })
};
