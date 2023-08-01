'use stict'

const Route = require('./route.model');
const Bus = require('../bus/bus.model');
const Account = require('../account/account.model');
const User = require('../user/user.model');
const { verify } = require('../utils/validate');

/* --- ADD --- */
exports.add = async(req, res) => {
    try {
        const data = req.body;
        data.attendant = req.user.sub;
        if (data.buses) {
            data.buses = [...new Set(data.buses)];
            let msg = ''
            for (const bus of data.buses) {
                if (
                    await Bus.findOne({ _id: bus })
                ) continue
                msg += ` ${bus}  no exists or not found,`;
            }
            msg.trim();
            if (msg)
                return res.status(404).send({ msg });
        }
        if (!data.stops)
            return res.status(418).send({ message: `Params stops is requerid` });
        delete data.comments;
        delete data.rates;
        const route = new Route(data);
        await route.save();
        return res.send({ message: `Route added successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding route`, err });
    }
}

/* --- GETs --- */
// All
exports.get = async(req, res) => {
    try {
        const routes = await Route.find()
            .populate({
                path: 'attendant',
                select: '_id name'
            })
            .populate({
                path: 'buses',
                select: '-route'
            })
            .populate({
                path: 'comments.user',
                select: '_id name surname photo'
            });
        return res.send({ routes });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting routes` });
    }
}

// One
exports.getOne = async(req, res) => {
    try {
        const { routeId } = req.params;
        const route = await Route.findOne({ _id: routeId })
            .populate({
                path: 'attendant',
                select: '_id name'
            })
            .populate({
                path: 'buses',
                select: '-route'
            })
            .populate({
                path: 'comments.user',
                select: '_id name surname photo'
            });
        if (!route)
            return res.status(404).send({ message: `Route not exist or not found` });
        return res.send({ route });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting route` });
    }
}

/* --- UPDATE --- */
exports.upda = async(req, res) => {
    try {
        const { routeId } = req.params;
        const data = req.body;
        delete data.comments;
        delete data.rates;
        let msg = '';
        if (!data.buses)
            msg += `Param buses is required\n`;
        if (!data.stops)
            msg += `Param stops is required\n`;
        if (!data.exits)
            msg += `Param exits is required\n`;
        if (!data.duration || data.duration == null || data.duration == undefined)
            msg += `Param duration is required\n`;
        msg.trim();
        if (msg)
            return res.status(418).send(msg);
        data.buses = [...new Set(data.buses)];
        let msg2 = ''
        for (const bus of data.buses) {
            if (
                await Bus.findOne({ _id: bus })
            ) continue
            msg2 += ` ${bus} no exists or not found,`;
        }
        msg2.trim();
        if (msg2)
            return res.status(404).send({ msg });
        const up = await Route.findOneAndUpdate({ _id: routeId }, data, { new: true });
        if (!up)
            return res.status(404).send({ message: `Route not found or not exist` });
        return res.send({ message: `Route updated successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error updating route`, err });
    }
}

/* --- DELETE --- */
exports.del = async(req, res) => {
    try {
        const { routeId } = req.params;
        if (!await Route.findOne({ _id: routeId }))
            return res.status(404).send({ message: `Route not found or not exist` });
        await Account.updateMany({ 'favorite-routes': { $all: routeId } }, {
            $pull: { 'favorite-routes': routeId }
        }, { new: true });
        await Bus.updateMany({ route: routeId }, { route: null });
        await Route.deleteOne({ _id: routeId }, { new: true });
        return res.send({ message: `Route deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting route` });
    }
}

/* --- BUSES --- */
// Add
exports.addB = async(req, res) => {
    try {
        const { qr, qib } = req.query;
        if (!await Bus.findOne({ _id: qib }))
            return res.status(404).send({ message: `Bus not found or not exist` });
        if (await Route.findOne({ $and: [{ _id: qr }, { 'buses': { $all: qib } }] }))
            return res.status(400).send({ message: `Bus exist in buses` });
        const upAdd = await Route.findOneAndUpdate({ _id: qr }, {
            $push: { 'buses': qib }
        }, { new: true });
        if (!upAdd)
            return res.status(404).send({ message: `Route not found or not exist` });
        return res.send({ message: `Bus added a buses` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error add bus from buses`, err });
    }
}

// Remove
exports.removeB = async(req, res) => {
    try {
        const { qr, qib } = req.query;
        if (!await Route.findOne({ _id: qr }))
            return res.status(404).send({ message: `Route not found or not exist` });
        if (!await Route.findOne({ $and: [{ _id: qr }, { 'buses': { $all: qib } }] }))
            return res.status(400).send({ message: `Bus no exist in buses` });
        await Route.updateOne({ _id: qr }, {
            $pull: { 'buses': qib }
        }, { new: true });
        return res.send({ message: `Bus remove from buses` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error remove bus from buses`, err });
    }
}

/* --- COMMENTs --- */
// Add
exports.addCU = async(req, res) => {
    try {
        const { qr, qiu } = req.query;
        const { sub } = req.user;
        if (!await Route.findOne({ _id: qr }))
            return res.status(404).send({ message: `Route not found or not exist` });
        if (!await User.findOne({ _id: qiu }) || sub != qiu)
            return res.status(404).send({ message: `User not foun or not exist` });
        if (await Route.findOne({ $and: [{ _id: qr }, { 'comments.user': { $all: qiu } }] }))
            return res.status(400).send({ message: `You have already commented on this route` });
        const data = {
            comment: req.body.comment,
            rate: req.body.rate
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        data.user = qiu;
        if (Number(data.rate) < 0 || Number(data.rate) > 5)
            return res.status(400).send({ message: `Only values between 0 and 5 are accepted` });
        const route = await Route.findOne({ _id: qr });
        let rates = 0;
        if (route.comments.length > 0) {
            for (const comment of route.comments) {
                rates = comment.rate + rates;
            }
        }
        rates = rates + Number(data.rate).toFixed(1);
        if (route.comments.length > 0)
            rates = Number(rates / (route.comments.length + 1)).toFixed(1);
        await Route.updateOne({ _id: qr }, {
            $push: { 'comments': data },
            rates: rates
        }, { new: true });
        return res.send({ message: `Comment added` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding comment`, err });
    }
}

// Update
exports.updaCU = async(req, res) => {
    try {
        const { qr, qiu, qicr } = req.query;
        const { sub } = req.user;
        if (!await Route.findOne({ _id: qr }))
            return res.status(404).send({ message: `Route not found or not exist` });
        if (!await User.findOne({ _id: qiu }) || sub != qiu)
            return res.status(404).send({ message: `User not foun or not exist` });
        if (!await Route.findOne({ $and: [{ _id: qr }, { 'comments.user': qiu }, { 'comments._id': qicr }] }))
            return res.status(400).send({ message: `This comment does not exist or is not owned by you` });
        const data = {
            comment: req.body.comment,
            rate: req.body.rate
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        data.user = qiu;
        if (Number(data.rate) < 0 || Number(data.rate) > 5)
            return res.status(400).send({ message: `Only values between 0 and 5 are accepted` });
        const route = await Route.findOne({ _id: qr }).lean();
        route.comments.splice(route.comments.findIndex(r => String(r._id) === qicr), 1);
        let rates = 0;
        if (route.comments.length > 0) {
            for (const comment of route.comments) {
                rates = comment.rate + rates;
            }
        }
        rates = rates + Number(data.rate);
        if (route.comments.length > 0)
            rates = Number(rates / (Number(route.comments.length) + 1)).toFixed(1);
        await Route.updateOne({
            $and: [
                { _id: qr },
                { 'comments._id': qicr }
            ]
        }, {
            $set: { 'comments.$': data },
            rates: rates
        }, { new: true });
        return res.send({ message: `Comment updated` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error updating comment`, err });
    }
}

// Remove
exports.removeCU = async(req, res) => {
    try {
        const { qr, qiu, qicr } = req.query;
        const { sub } = req.user;
        if (!await Route.findOne({ _id: qr }))
            return res.status(404).send({ message: `Route not found or not exist` });
        if (!await User.findOne({ _id: qiu }) || sub != qiu)
            return res.status(404).send({ message: `User not foun or not exist` });
        if (!await Route.findOne({ $and: [{ _id: qr }, { 'comments.user': qiu }, { 'comments._id': qicr }] }))
            return res.status(400).send({ message: `This comment does not exist or is not owned by you` });

        /* Restar la cantidad del comentario eliminado */
        const route = await Route.findOne({ _id: qr }).lean();
        route.comments.splice(route.comments.findIndex(r => String(r._id) === qicr), 1);
        let rates = 0;
        if (route.comments.length > 0) {
            for (const comment of route.comments) {
                rates = comment.rate + rates;
            }
        }
        if (route.comments.length > 0)
            rates = Number(rates / (route.comments.length)).toFixed(1);
        await Route.updateOne({
            $and: [
                { _id: qr }
            ]
        }, {
            $pull: {
                'comments': {
                    '_id': qicr
                }
            },
            rates: rates
        }, { new: true });
        return res.send({ message: `Comment removed` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting comment`, err });
    }
}

/* --- TEST --- */
exports.test = (req, res) => {
    res.send({ message: `Hi route` });
}