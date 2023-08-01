'use strict'

const Request = require('./request.model');
const {} = require('../utils/validate');

/* ----- FUCTIONS PUBLIC ----- */
/* --- SEND --- */
exports.sen = async(req, res) => {
    try {
        const data = req.body;
        const request = new Request(data);
        await request.save();
        return res.status({ message: `The request has been sent, in the next few days you will be receiving a response` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error send request`, err });
    }
}

/* ----- FUCTIONS PRIVATE ----- */
/* --- GETs --- */
// All
exports.get = async(req, res) => {
    try {
        const requests = await Request.find();
        return res.send({ requests });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting requests` });
    }
}

// One 
exports.getOne = async(req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ _id: requestId });
        if (!request)
            return res.status(404).send({ message: `Request not found or not exists` });
        return res.send({ request });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error gettin request` });
    }
}

/* --- ACCEPT --- */
exports.accept = async(req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ _id: requestId });
        if (!request)
            return res.status(404).send({ message: `Request not found or not exists` });
        await Request.updateOne({ _id: requestId }, { state: 'approved' }, { new: true });
        const user = {
            name: request.name,
            password: request.name,
            email: request.company.email
        }
        return res.send({ message: `Application accepted`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Failed to accept request` });
    }
}

/* --- REFUSED --- */
exports.refu = async(req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ _id: requestId });
        if (!request)
            return res.status(404).send({ message: `Request not found or not exists` });
        await Request.updateOne({ _id: requestId }, { state: 'refused' }, { new: true });
        return res.send({ message: `The request has been denied` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error denying the request` });
    }
}

/* --- TEST --- */
exports.test = (req, res) => {
    res.send({ message: `Hi request` });
}