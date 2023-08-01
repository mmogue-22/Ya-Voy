'use strict'

const api = require('express').Router();
const accountController = require('./account.controller');
const { ensureAdvance, isAdmin, isUser } = require('../services/authenticated');

/* ----- PRIVATE ----- */
// --- @admin --- //
api.get('/test', [ensureAdvance, isAdmin], accountController.test);

// --- @global --- //
api.post('/create/:userId', [ensureAdvance, isUser], accountController.create);
api.get('/get/my*', [ensureAdvance, isUser], accountController.getMy);
api.put('/add-favorite-route/there*', [ensureAdvance, isUser], accountController.addFR);
api.put('/remove-favorite-route/there*', [ensureAdvance, isUser], accountController.removeFR);
api.put('/new-alarm/:accountId', [ensureAdvance, isUser], accountController.addA);
api.put('/update-alarm/there*', [ensureAdvance, isUser], accountController.updaA);
api.put('/delete-alarm/there*', [ensureAdvance, isUser], accountController.delA);

module.exports = api;