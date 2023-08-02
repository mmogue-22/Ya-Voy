'use strict'

const User = require('./user.model');
const Bus = require('../bus/bus.model');
const Route = require('../route/route.model');
const { encrypt, check, verify, randomNo, upload } = require('../utils/validate');
const { createTK } = require('../services/jwt');
const fs = require('fs');
const path = require('path');
const directory = './src/uploads/users/';

/* --- USER DEFAULT --- */
exports.sF3ae3we = async() => {
    try {
        if (!await User.findOne({ username: 'admin' })) {
            const data = {
                name: 'admin',
                username: 'admin',
                password: '220',
                email: 'info@yavoy.org.gt',
                role: 'kinalero'
            }
            data.password = await encrypt(data.password);
            const u = new User(data);
            await u.save();
            return console.log(`User default created`);
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}

/* ----- PUBLIC ----- */
// Login
exports.login = async(req, res) => {
    try {
        const data = {
            usernameOrEmail: req.body.usernameOrEmail,
            password: req.body.password
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        const user = await User.findOne({
            $or: [
                { username: data.usernameOrEmail },
                { email: data.usernameOrEmail }
            ]
        }).lean();
        if (user && await check(data.password, user.password)) {
            const token = await createTK(user);
            switch (user.role) {
                case 'kinalero':
                    user.role = '2dT0ldi'
                    break;
                case 'admin':
                    user.role = 'Pq38sRl'
                    break;
                case 'company':
                    user.role = 'v2T3srZ'
                    break;
                default:
                    user.role = 'qgEE30w'
                    break;
            }
            const logged = {
                name: user.name,
                surname: `${user.surname ? user.surname : ''}`,
                username: user.username,
                t4Ca59q: `${user.photo ? user.photo : ''}`,
                Qdt3caW4: user.role
            }
            return res.send({ message: `Logged`, IN6AV: token, logged });
        }
        return res.status(401).send({ message: `Invalid Credentials` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error login` });
    }
}

// Register (user "Client")
exports.register = async(req, res) => {
    try {
        const data = req.body;
        const msg = verify({ name: data.name, surname: data.surname, birthday: data.birthday, phone: data.phone, password: data.password });
        if (msg)
            return res.status(418).send(msg);
        data.role = 'user';
        data.password = await encrypt(data.password);
        data.username = await generateUsername(data.name, data.surname);
        const user = new User(data);
        await user.save();
        const token = await createTK(user);
        switch (user.role) {
            case 'kinalero':
                user.role = '2dT0ldi'
                break;
            case 'admin':
                user.role = 'Pq38sRl'
                break;
            case 'company':
                user.role = 'v2T3srZ'
                break;
            default:
                user.role = 'qgEE30w'
                break;
        }
        const logged = {
            name: user.name,
            surname: `${user.surname ? user.surname : ''}`,
            username: user.username,
            t4Ca59q: `${user.photo ? user.photo : ''}`,
            Qdt3caW4: user.role
        }
        return res.send({ message: `Register completed`, UI: user._id, IN6AV: token, logged });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error register`, err });
    }
}

/* ----- PRIVATE ----- */
/* --- ADDs --- */
// @admin
exports.addAd = async(req, res) => {
    try {
        const data = req.body;
        const msg = verify({ name: data.name, surname: data.surname, birthday: data.birthday });
        if (msg)
            return res.status(418).send(msg);
        data.role = 'admin';
        data.username = await generateUsername(data.name, data.surname);
        data.password = await encrypt(data.username);
        delete data.phone;
        const user = new User(data);
        await user.save();
        return res.send({ message: `Admin added successfully`, UI: user._id });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding admin`, err });
    }
}

// @company
exports.addCo = async(req, res) => {
    try {
        const data = req.body;
        const msg = verify({ name: data.name, password: data.password });
        if (msg)
            return res.status(418).send(msg);
        data.role = 'company';
        data.password = await encrypt(data.name);
        data.username = data.name;
        delete data.phone;
        delete data.birthday;
        delete data.surname;
        const user = new User(data);
        await user.save();
        return res.send({ message: `Company added successfully`, UI: user._id });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error adding company`, err });
    }
}

/* --- GETs --- */
// One
exports.getOne = async(req, res) => {
    try {
        const { id } = req.params;
        const { role, sub } = req.user;
        let user;
        switch (role) {
            case 'kinalero':
                user = await User.findOne({ _id: id }, { password: 0 });
                break;
            case 'admin':
                user = await User.findOne({
                    _id: id,
                    $or: [
                        { role: 'user' },
                        { role: 'company' }
                    ]
                }, { password: 0 });
                break;
            default:
                if (sub === id)
                    user = await User.findOne({
                        $and: [
                            { _id: id },
                            { role: 'company' }
                        ]
                    }, { password: 0 });
                break;
        }
        if (!user)
            return res.status(404).send({ message: `User not found or not exists` });
        return res.send({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting` });
    }
}

// @admins
exports.getAd = async(req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });
        return res.send({ admins });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting admins` });
    }
}

// @users
exports.getUs = async(req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        return res.send({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting users` });
    }
}

// @companies
exports.getCo = async(req, res) => {
    try {
        const companies = await User.find({ role: 'company' });
        return res.send({ companies });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting companies` });
    }
}

// Photo
exports.getImg = async(req, res) => {
    try {
        const { img } = req.params;
        const route = `${directory}${img}`;
        if (!fs.existsSync(route))
            return res.status(404).send({ message: `Image not found` });
        return res.sendFile(path.resolve(route));
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting photo` });
    }
}

/* --- UPDATEs --- */
// Data (@admin and @user)
exports.upda = async(req, res) => {
    try {
        const { userId } = req.params;
        const { sub, role } = req.user;
        let data = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        data.username = await generateUsername(data.name, data.surname);
        const user = await User.findOne({ _id: userId });
        if (!user)
            return res.status(404).send({ message: `User not found or not exist` });
        if ((await User.findOne({ username: 'admin' }))._id == user._id)
            return res.status(404).send({ message: `You can't updated this type of user` });
        switch (role) {
            case 'kinalero':
                if (user.role == 'kinalero')
                    if (sub != String(user._id))
                        return res.status(400).send({ message: `You can't update this type of user` });
                await User.updateOne({ _id: user._id }, data, { new: true });
                return res.send({ message: `Profile has been updated` });
                break;
            case 'admin':
                if (user.role == 'kinalero')
                    return res.status(400).send({ message: `You can't update this type of user` });
                if (user.role == 'admin')
                    if (sub != String(user._id))
                        return res.status(400).send({ message: `You can't update this type of user` });
                data.birthday = req.body.birthday;
                data.phone = req.body.phone;
                const msg2 = verify(data);
                if (msg2)
                    return res.status(418).send(msg2);
                await User.updateOne({ _id: user._id }, data, { new: true });
                return res.send({ message: `Profile has been updated` });
                break;
            default:
                if (sub != String(user._id))
                    return res.status(400).send({ message: `You can only update your account` });
                data.birthday = req.body.birthday;
                data.phone = req.body.phone;
                const msg3 = verify(data);
                if (msg3)
                    return res.status(418).send(msg3);
                await User.updateOne({ _id: user._id }, data, { new: true });
                return res.send({ message: `Profile has been updated` });
                break;
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error updating user` });
    }
}

// Password
exports.updaPass = async(req, res) => {
    try {
        const { userId } = req.params;
        const { sub } = req.user;
        const data = {
            oldPass: req.body.oldPass,
            newPass: req.body.newPass
        }
        const msg = verify(data);
        if (msg)
            return res.status(418).send(msg);
        const user = await User.findOne({ _id: userId });
        if (!user)
            return res.status(404).send({ message: `User not found or not exist` });
        if (sub != String(user._id))
            return res.status(401).send({ message: `You don't have access this accion` });
        if (!await check(data.oldPass, user.password))
            return res.status(402).send({ message: `The password entered does not match` });
        if (Date.now() <= Math.floor(user.updateAt + (1000 * 60 * 60 * 24 * 30)))
            return res.status(400).send({ message: `You have made a password change before` });
        await User.updateOne({ _id: user._id }, { password: data.newPass, updateAt: Date.now() }, { new: true });
        return res.send({ message: `The password has been changed` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error updating password`, err });
    }
}

/* --- DELETE --- */
exports.del = async(req, res) => {
    try {
        const { userId } = req.params;
        const { sub, role } = req.user;
        const user = await User.findOne({ _id: userId });
        if (!user)
            return res.status(404).send({ message: `User not found or not exist` });
        if ((await User.findOne({ username: 'admin' }))._id == user._id)
            return res.status(404).send({ message: `You can't delete this type of user` });
        switch (role) {
            case 'kinalero':
                if (user.role == 'kinalero')
                    if (sub != String(user._id))
                        return res.status(400).send({ message: `You can't delete this type of user` });
                await User.deleteOne({ _id: userId }, { new: true });
                return res.send({ message: `User deleted successfully` });
                break;
            case 'admin':
                if (user.role == 'kinalero')
                    return res.status(400).send({ message: `You can't delete this type of user` });
                if (user.role == 'admin')
                    if (sub != String(user._id))
                        return res.status(400).send({ message: `You can't delete this type of user` });
                await User.deleteOne({ _id: userId }, { new: true });
                return res.send({ message: `User deleted successfully` });
                break;
            case 'company':
                if (sub != String(user._id))
                    return res.status(400).send({ message: `You can only delete your account` });
                if (
                    await Bus.findOne({ owner: user._id }) || await Route.findOne({ attendant: user._id })
                ) return res.status(400).send({ message: `You cannot delete this account since you have a bus or linked route` });
                await User.deleteOne({ _id: userId }, { new: true });
                return res.send({ message: `User deleted successfully` });
                break;
            default:
                if (sub != String(user._id))
                    return res.status(400).send({ message: `You can only delete your account` });
                await User.deleteOne({ _id: userId }, { new: true });
                return res.send({ message: `User deleted successfully` });
                break;
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting user` });
    }
}

/* --- UPLOAD IMG --- */
exports.uploadImg = async(req, res) => {
    try {
        if (!req.files.photo)
            return res.status(400).send({ message: `Have not sent image` });
        const { userId } = req.params;
        const photo = req.files.photo;
        const user = await User.findOne({ _id: userId });
        if (user) {
            if (req.user.sub != String(user._id))
                return res.status(403).send({ message: `You don't have access this accion` });
            if (user.photo)
                if (fs.existsSync(`${directory}${user.photo}`))
                    fs.unlinkSync(`${directory}${user.photo}`);
            const name = upload(photo.path, 'I');
            await User.updateOne({ _id: user._id }, { photo: name }, { new: true });
            return res.send({ message: `Photo added successfully`, name: name });
        }
        fs.unlinkSync(`${photo.path}`);
        return res.status(404).send({ message: `User not found or not exist` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error uploading photo` });
    }
}

/* ---------- FUNCTIONS ---------- */
// GENERATE USERNAME
const generateUsername = async(name, surname) => {
    const names = name.split(' ');
    const surnames = surname.split(' ');
    let bandera = true;
    let letra = names[0];
    let sur = surnames[0];
    let no = randomNo(4, true);
    let username = `${letra[0]}${sur}-${no}`;
    while (bandera == false) {
        if (await User.findOne({ username: username })) {
            no = randomNo(4, true);
            username = `${letra[0]}${sur}-${no}`;
            console.log(username);
            return bandera = true;
        }
        bandera = false;
    }
    return username;
}

/* --- TEST --- */
exports.test = (req, res) => {
    res.send({ message: `Hi users` });
}