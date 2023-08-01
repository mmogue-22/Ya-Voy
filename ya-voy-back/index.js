'use strict'

require('dotenv').config()

const { connect } = require('./configs/mongo');
const { initServer } = require('./configs/app');
const { sF3ae3we } = require('./src/user/user.controller');

initServer();
connect();
sF3ae3we();