'use strict'

const api = require('express').Router();
const requestController = require('./request.controller');
const { ensureAdvance, isAdmin } = require('../services/authenticated');

/* ----- PRIVATE ----- */
// --- @admin --- //
api.get('/test', [ensureAdvance, isAdmin], requestController.test);
api.get('/get', [ensureAdvance, isAdmin], requestController.get);
api.get('/get/:requestId', [ensureAdvance, isAdmin], requestController.getOne);
api.put('/accept/:requestId', [ensureAdvance, isAdmin], requestController.accept);
api.put('/refused/:requestId', [ensureAdvance, isAdmin], requestController.refu);

// --- @global --- //

/* ----- PUBLIC ----- */
api.post('/send', requestController.sen);

module.exports = api;