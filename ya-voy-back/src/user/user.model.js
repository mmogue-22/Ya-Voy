'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: { // Required field only for admins and users
        type: String
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: { // Required field only for admins and users
        type: Date
    },
    phone: { // Required field only for users
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['kinalero', 'admin', 'user', 'company'],
        default: 'user',
        lowercase: true
    },
    updateAt: {
        type: Number
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);