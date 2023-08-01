'use strict'

const { Server } = require('socket.io')
const http = require('http')
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3020 || 3000;
const server = http.createServer(app);
const configCors = {
    cors: {
        origin: '*'
    }
}
const socketServer = new Server(server, configCors);

/* ----- IMPORT ROUTES ----- */
const userRoutes = require('../src/user/user.routes');
const busRoutes = require('../src/bus/bus.routes');
const accountRoutes = require('../src/account/account.routes');
const routeRoutes = require('../src/route/route.routes');
const requestRoutes = require('../src/request/request.routes');

/* ----- CONFIG SERVER ----- */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

socketServer.use((sock, next) => {
    next();
});

app.use('/user', userRoutes);
app.use('/bus', busRoutes);
app.use('/account', accountRoutes);
app.use('/route', routeRoutes);
app.use('/request', requestRoutes);

/* ----- DEPLOYED SERVER ----- */
exports.initServer = () => {
    app.listen(port);
    console.log(`Server HTTP running in port ${port}`);
}