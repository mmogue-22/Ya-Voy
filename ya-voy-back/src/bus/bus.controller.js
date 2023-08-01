'use strict'

const Bus = require('./bus.model');
const Route = require('../route/route.model');
const { upload, verify } = require('../utils/validate');
const fs = require('fs')
const path = require('path');
const directory = './src/uploads/buses/'
const sesitive = {
    path: 'owner',
    select: '-password -email -role'
}

/* --- ADD --- */
exports.add = async(req, res) => {
    try {
        const data = req.body;
        if (data.route) {
            if (!await Route.findOne({ _id: data.route }))
                return res.status(404).send({ messagea: `Route not found or not exists` });
        }
        const bus = new Bus(data);
        await bus.save();
        return res.send({ message: `Bus created`, IB: bus._id });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding bus`, err });
    }
}

/* --- GETs --- */
// All
exports.get = async(req, res) => {
    try {
        const buses = await Bus.find({})
            .populate(sesitive);
        return res.send({ buses });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting buses` });
    }
}

// One
exports.getOne = async(req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findOne({ _id: busId })
            .populate(sesitive);
        if (!bus)
            return res.status(404).send({ message: `Bus not found or not exist` });
        return res.send({ bus });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting bus` });
    }
}

// For Company
exports.getForCompany = async(req, res) => {
    try {
        const { companyId } = req.params;
        const buses = await Bus.find({ owner: companyId })
            .populate(sesitive);
        return res.send({ buses });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting for company` });
    }
}

// Img
exports.getImg = async(req, res) => {
    try {
        const { img } = req.params;
        const route = `${directory}${img}`;
        if (!fs.existsSync(route))
            return res.status(404).send({ message: `Image not found` });
        return res.sendFile(path.resolve(route));
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting img` });
    }
}

/* --- UPDATEs --- */
// Data
exports.upda = async(req, res) => {
    try {
        const { busId } = req.params;
        const data = {
            tuition: req.body.tuition,
            characteristics: req.body.characteristics,
            state: req.body.state
        }
        if (req.body.no)
            data.no = req.body.no
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        const up = await Bus.findOneAndUpdate({ _id: busId }, data, { new: true });
        if (!up)
            return res.status(404).send({ message: `Bus not found or not exist` });
        return res.send({ message: `Bus updated successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error updating bus`, err });
    }
}

// Change State
exports.changeState = async(req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findOne({ _id: busId });
        if (!bus)
            return res.status(404).send({ message: `Bus not found or not exist` });
        if (bus.state == 'active') {
            await Bus.updateOne({ _id: busId }, { state: 'disabled' }, { new: true });
            return res.send({ message: `Bus status changed` });
        } else {
            await Bus.updateOne({ _id: busId }, { state: 'active' }, { new: true });
            return res.send({ message: `Bus status changed` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error change state the bus` });
    }
}

/* --- DELETE --- */
exports.del = async(req, res) => {
    try {
        const { busId } = req.params;
        if (!await Bus.findOne({ _id: busId }))
            return res.status(404).send({ message: `Bus not found or not exist` });
        await Route.updateMany({ 'buses': busId }, {
            $pull: { 'buses': busId }
        }, { new: true });
        await Bus.deleteOne({ _id: busId }, { new: true });
        return res.send({ message: `Bus deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting bus` });
    }
}

/* --- UPLOAD IMG --- */
exports.uploadImg = async(req, res) => {
    try {
        if (!req.files.images)
            return res.status(400).send({ message: `Have not sent images` });
        const { busId } = req.params;
        const imgs = req.files.images;
        let names = [];
        const bus = await Bus.findOne({ _id: busId });
        if (bus) {
            if (bus.photos) {
                for (const photo of bus.photos) {
                    if (fs.existsSync(`${directory}${photo}`))
                        fs.unlinkSync(`${directory}${photo}`);
                }
            }
            if (Array.isArray(imgs)) {
                for (const img of imgs)
                    names.push(upload(img.path, 'I'));
            } else {
                names.push(upload(imgs.path));
            }
            await Bus.updateOne({ _id: bus._id }, { photos: names }, { new: true });
            return res.send({ message: `Photos added successfully` });
        } else {
            if (Array.isArray(imgs)) {
                for (const img of imgs)
                    fs.unlinkSync(`${img.path}`);
            } else {
                fs.unlinkSync(`${imgs.path}`);
            }
            return res.status(404).send({ message: `Bus not found or not exist` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error uploading img's` });
    }
}

/* --- TEST --- */
exports.test = (req, res) => {
    res.send({ message: `Hi bus` });
}