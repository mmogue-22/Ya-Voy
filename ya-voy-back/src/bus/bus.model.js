'use strict'

const mongoose = require('mongoose');

const busSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tuition: {
        type: String,
        uppercase: true,
        minLength: 7,
        maxLength: 7,
        required: true,
        unique: true
    },
    no: { // This does have a company classification
        type: String
    },
    characteristics: {
        type: String,
        required: true,
        default: 'None'
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    },
    state: {
        type: String,
        lowercase: true,
        enum: ['active', 'disabled'],
        default: 'active',
    },
    photos: {
        type: [String]
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Buse', busSchema);