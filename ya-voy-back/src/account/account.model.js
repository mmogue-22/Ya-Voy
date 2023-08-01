'use strict'

const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    'favorite-routes': {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true
        }]
    },
    alarms: {
        type: [{
            name: {
                type: String,
                default: 'New Alarm'
            },
            days: {
                type: [String],
                default: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDEY'],
                required: true
            },
            hour: {
                type: String,
                required: true,
                default: '06:00:00'
            },
            route: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Route',
                required: true
            },
        }]
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Account', accountSchema);