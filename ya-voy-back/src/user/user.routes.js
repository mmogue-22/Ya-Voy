'use strict'

const api = require('express').Router()
const userController = require('./user.controller');
const { ensureAdvance, isAdmin, isKinalero, isCompany } = require('../services/authenticated');
const multiparty = require('connect-multiparty');
const upload = multiparty({ uploadDir: './src/uploads/users/' });

/* ----- PRIVATE ----- */
// --- @admin --- //
api.post('/add-admin', [ensureAdvance, isKinalero], userController.addAd);
api.post('/add-company', [ensureAdvance, isAdmin], userController.addCo);
api.get('/test', [ensureAdvance, isAdmin], userController.test);
api.get('/get/:id', [ensureAdvance, isCompany], userController.getOne);
api.get('/get-admins', [ensureAdvance, isKinalero], userController.getAd);
api.get('/get-users', [ensureAdvance, isAdmin], userController.getUs);
api.get('/get-companies', [ensureAdvance, isAdmin], userController.getCo);

// --- @global ---  //
api.get('/get-img/:img', [ensureAdvance, upload], userController.getImg);
api.put('/update-pass/:userId', [ensureAdvance], userController.updaPass);
api.put('/upload-img/:userId', [ensureAdvance, upload], userController.uploadImg);

/* ----- PUBLIC ----- */
api.post('/login', userController.login);
api.post('/register', userController.register);

module.exports = api;