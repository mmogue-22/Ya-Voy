'use strict'

const api = require('express').Router();
const busController = require('./bus.controller');
const { ensureAdvance, isAdmin, isCompany } = require('../services/authenticated');
const multiparty = require('connect-multiparty');
const upload = multiparty({ uploadDir: './src/uploads/buses/' });

/* ----- PRIVATE ----- */
// --- @admin --- //
api.get('/test', [ensureAdvance, isAdmin], busController.test);
api.post('/add', [ensureAdvance, isCompany], busController.add);
api.put('/upload-imgs/:busId', [ensureAdvance, isCompany, upload], busController.uploadImg);
api.put('/update/:busId', [ensureAdvance, isCompany], busController.upda);
api.put('/change-state/:busId', [ensureAdvance, isCompany], busController.changeState);
api.delete('/delete/:busId', [ensureAdvance, isCompany], busController.del);

// --- @global --- //
api.get('/get-for-company/:companyId', [ensureAdvance], busController.getForCompany);

/* ----- PUBLIC ----- */
api.get('/get', busController.get);
api.get('/get/:busId', busController.getOne);
api.get('/get-img/:img', [upload], busController.getImg);

module.exports = api;