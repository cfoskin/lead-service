const express = require('express');
const LeadApi = require('./app/api/lead');

/* routes for push configuration api */
module.exports = (function() {
    'use strict';
    const api = express.Router();
     //Leads
    api.post('/leads', LeadApi.create);
    api.delete('/leads/:id', LeadApi.delete);
    api.get('/leads/:id', LeadApi.getOne);
    api.get('/leads', LeadApi.getAll);
    api.put('/leads/:id', LeadApi.sendBroadcast);
    api.post('/leads/sendleads/:id', LeadApi.sendLeads);
    return api;
})();
