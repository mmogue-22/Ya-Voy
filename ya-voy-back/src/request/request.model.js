'use strict'

const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    company: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    createdAd: {
        type: Date,
        default: new Date()
    },
    state: {
        type: String,
        lowercase: true,
        default: 'earring',
        enum: ['earring', 'refused', 'approved']
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Request', requestSchema);