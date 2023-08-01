'use strict'

const Account = require('./account.model');
const User = require('../user/user.model');
const Route = require('../route/route.model');
const { verify } = require('../utils/validate');

/* --- CREATE --- */
exports.create = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ _id: userId });
        if (!user)
            return res.status(404).send({ message: `User nor found or not exist` });
        if (!await Account.findOne({ owner: user._id })) {
            const account = new Account({ owner: user._id });
            await account.save();
            return res.send({ message: `Account created successfully` });
        }
        return res.status(400).send({ message: `User have account` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error creating account`, err });
    }
}

/* --- FAVORITE ROUTES --- */
// Add
exports.addFR = async(req, res) => {
    try {
        const { qa, qr } = req.query;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: qa });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        if (!await Route.findOne({ _id: qr }))
            return res.status(404).send({ message: `Route not exists or not found` });
        if (
            await Account.findOne({ $and: [{ owner: sub }, { 'favorite-routes': { $all: qr } }] })
        ) return res.status(400).send({ message: `Route exist in favorite` });
        await Account.updateOne({ _id: qa }, {
            $push: { 'favorite-routes': qr }
        }, { new: true });
        return res.send({ message: `Route added to favorite` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding route to favorite` });
    }
}

// Remove
exports.removeFR = async(req, res) => {
    try {
        const { qa, qr } = req.query;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: qa });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        if (!await Account.findOne({ $and: [{ owner: sub }, { 'favorite-routes': { $all: qr } }] }))
            return res.status(404).send({ message: `Route no exist in favorite` });
        await Account.updateOne({ _id: qa }, {
            $pull: { 'favorite-routes': qr }
        }, { new: true });
        return res.send({ message: `Remove route from favorites` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting route to favorites ` });
    }
}

/* --- FAVORITE BUS --- */
/* // Add
exports.addFR = async(req, res) => {
    try {
        const { qa, qb } = req.query;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: qa });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        if (!await Bus.findOne({ _id: qb }))
            return res.status(404).send({ message: `Bus not found or not exist` });
        if (
            await Account.findOne({ $and: [{ owner: sub }, { 'favorite-buses': { $all: qb } }] })
        ) return res.status(400).send({ message: `Bus exist in favorite` });
        await Account.updateOne({ _id: qa }, {
            $push: { 'favorite-buses': qb }
        }, { new: true });
        return res.send({ message: `Bus added to favorite` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding bus to favorites` });
    }
}

// Remove
exports.removeFB = async(req, res) => {
    try {
        const { qa, qb } = req.query;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: qa });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        if (!await Account.findOne({ $and: [{ owner: sub }, { 'favorite-buses': { $all: qb } }] }))
            return res.status(400).send({ message: `Bus no exist in favorite` });
        await Account.updateOne({ _id: qa }, {
            $pull: { 'favorite-buses': qb }
        }, { new: true });
        return res.send({ message: `Remove bus from favorites` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting bus to favorites` });
    }
} */

/* --- ALARM --- */
// Add
exports.addA = async(req, res) => {
    try {
        const { accountId } = req.params;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: accountId });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        const data = {
            name: req.body.name,
            days: req.body.days,
            hour: req.body.hour,
            route: req.body.route
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        if (!await Route.findOne({ _id: data.route }))
            return res.status(404).send({ message: `Route not exists or not found` });
        await Account.updateOne({ _id: accountId }, {
            $push: { 'alarms': data }
        }, { new: true });
        return res.send({ message: `The new alarm was created successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding alarm`, err });
    }
}

// Update
exports.updaA = async(req, res) => {
    try {
        const { qa, qir } = req.query;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: qa });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        if (!await Account.findOne({ $and: [{ _id: qa }, { 'alarms._id': { $all: qir } }] }))
            return res.status(404).send({ message: `This alarm does not exist or was not found within your list` });
        const data = {
            name: req.body.name,
            days: req.body.days,
            hour: req.body.hour,
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        await Account.updateOne({
            $and: [
                { _id: qa },
                { 'alarms._id': qir }
            ]
        }, { $set: { 'alarms.$': data } }, { new: true });
        return res.send({ message: `Alarm updated successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error updating alarm` });
    }
}

// Delete
exports.delA = async(req, res) => {
    try {
        const { qa, qir } = req.query;
        const { sub } = req.user;
        const account = await Account.findOne({ _id: qa });
        if (!account && sub != String(account.owner))
            return res.status(404).send({ message: `Account not exist or not found` });
        if (!await Account.findOne({ $and: [{ _id: qa }, { 'alarms._id': { $all: qir } }] }))
            return res.status(404).send({ message: `This alarm does not exist or was not found within your list` });
        await Account.updateOne({
            $and: [
                { _id: qa }
            ]
        }, {
            $pull: { 'alarms': { '_id': qir } }
        }, { new: true });
        return res.send({ message: `Alarm deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting alarm` });
    }
}

/* --- GETs --- */
// All

// My
exports.getMy = async(req, res) => {
    try {
        const { qui } = req.query;
        const { sub } = req.user;
        if (sub != qui)
            return res.status(404).send({ message: `Account not exist or not found` });
        const account = await Account.findOne({ owner: qui })
            .populate({
                path: 'favorite-routes',
                select: '-comments'
            });
        return res.send({ account });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting account` });
    }
}

/* --- TEST --- */
exports.test = (req, res) => {
    res.send({ message: `Hi account` });
}