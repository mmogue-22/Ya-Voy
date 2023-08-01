'use strict'

const mongoose = require('mongoose');

const routeSchema = mongoose.Schema({
    attendant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Buse'
        }]
    },
    stops: {
        type: [{
            address: {
                country: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                town: {
                    type: String,
                    required: true
                }
            },
            coordinates: {
                latitude: {
                    type: String,
                    required: true
                },
                longitude: {
                    type: String,
                    required: true
                }
            },
            time: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    exits: {
        type: [String],
        default: ['06:00:00']
    },
    duration: {
        type: String,
        default: '01:30:00'
    },
    comments: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                default: ' '
            },
            rate: {
                type: Number,
                min: 0,
                max: 5,
                required: true
            }
        }]
    },
    rates: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Route', routeSchema);