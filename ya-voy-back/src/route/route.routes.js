'use strict'

const api = require('express').Router()
const routeController = require('./route.controller');
const { ensureAdvance, isAdmin, isCompany, isUser } = require('../services/authenticated');

/* ----- PRIVATE ----- */
// --- @admin --- //
api.get('/test', [ensureAdvance, isAdmin], routeController.test);
api.post('/add', [ensureAdvance, isCompany], routeController.add);
api.put('/update/:routeId', [ensureAdvance, isCompany], routeController.upda);
api.put('/add-bus/there*', [ensureAdvance, isCompany], routeController.addB);
api.put('/remove-bus/there*', [ensureAdvance, isCompany], routeController.removeB);
api.delete('/delete/:routeId', [ensureAdvance, isCompany], routeController.del);

// --- @global --- //
api.put('/add-comment/there*', [ensureAdvance, isUser], routeController.addCU);
api.put('/update-comment/there*', [ensureAdvance, isUser], routeController.updaCU);
api.put('/remove-comment/there*', [ensureAdvance, isUser], routeController.removeCU);

/* ----- PUBLIC ----- */
api.get('/get', routeController.get);
api.get('/get/:routeId', routeController.getOne);

module.exports = api;