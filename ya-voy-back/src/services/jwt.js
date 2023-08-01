'use strict'

const jwt = require('jsonwebtoken');

/* --- CREATE TOKEN --- */
exports.createTK = async(user = {}) => {
    try {
        const payload = {
            sub: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: Date.now(),
            exp: Math.floor(Date.now() + ((1000 * 60) * 120))
        }
        return jwt.sign(payload, `${process.env.KEY_DECODE}`);
    } catch (err) {
        console.error(err);
        return err;
    }
}