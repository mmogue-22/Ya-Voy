'use strict'

const mongoose = require('mongoose');

exports.connect = async() => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(`${process.env.URI_MONGO}`)
        console.log(`Connect to DB @YaVoy`);
    } catch (err) {
        console.error(err);
        return err;
    }
}