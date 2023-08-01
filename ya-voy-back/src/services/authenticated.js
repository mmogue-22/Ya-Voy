'use strict'

const jwt = require('jsonwebtoken');

/* --- MIDDLEWARE --- */
exports.ensureAdvance = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: `Doesn't contain header "AUTHORIZATION"` });
    } else {
        try {
            const token = req.headers.authorization.replace(/['"]+/g, '');
            const payload = jwt.decode(token, `${process.env.KEY_DECODE}`);
            if (Date.now() >= payload.exp)
                return res.status(401).send({ message: `Expired Token` });
            req.user = payload;
            next();
        } catch (err) {
            console.error(err);
            return res.status(418).send({ message: `Invalid Token >:[` });
        }
    }
}

/* --- ACCESS --- */
// @kinalero 
exports.isKinalero = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'kinalero')
        return res.status(403).send({ message: `You don't have access` });
    next();
}

// @admin 
exports.isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'kinalero' && role !== 'admin')
        return res.status(403).send({ message: `You don't have access` });
    next();
}

// @admin - @user
exports.isUser = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'kinalero' && role !== 'admin' && role !== 'user')
        return res.status(403).send({ message: `You don't have access` });
    next();
}

// @admin - @company
exports.isCompany = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'kinalero' && role !== 'admin' && role !== 'company')
        return res.status(403).send({ message: `You don't have access` });
    next();
}