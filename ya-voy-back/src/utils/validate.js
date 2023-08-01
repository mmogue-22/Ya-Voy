'use strict'

const bcrypt = require('bcrypt');
const fs = require('fs');

/* --- ENCRYPT --- */
exports.encrypt = async(data = '') => {
    try {
        return await bcrypt.hash(data, 10);
    } catch (err) {
        console.error(err);
        return err;
    }
}

/* --- CHECK HASH --- */
exports.check = async(text = '', hash = '') => {
    try {
        return await bcrypt.compare(text, hash);
    } catch (err) {
        console.error(err);
        return err;
    }
}

/* --- VALIDATE DATA --- */
exports.verify = (data = {}) => {
    const keys = Object.keys(data);
    let msg = '';
    for (const key of keys) {
        if (data[key] !== null &&
            data[key] !== undefined &&
            data[key] !== '') continue
        msg += `Param ${key} is required\n`;
    }
    return msg.trim();
}

/* ----- RANDOM NUMBER ----- */
exports.randomNo = (length = 0, hex) => {
    let no = '';
    for (let i = 0; i < length; i++) {
        let num = Math.floor(Math.random() * (57 - 48)) + 48;
        let letra = Math.floor(Math.random() * (122 - 97)) + 97;
        let decision = Math.floor(Math.random() * (4 - 2)) + 2;
        let caracter;
        if (hex) {
            if (decision == 3)
                caracter = String.fromCharCode(num);
            else if (decision == 2)
                caracter = String.fromCharCode(letra);
            no += `${caracter}`;
        } else {
            caracter = String.fromCharCode(num);
            no += `${caracter}`;
        }
    }
    return no;
}

/* ----- IS_IMAGE ----- */
exports.isImage = (extension = '') => {
    if (extension !== 'png' &&
        extension !== 'jpg' &&
        extension !== 'jpeg') return false;
    return true
}

/* ----- IS_PDF ----- */
exports.isPDF = (extension = '') => {
    if (extension !== 'pdf')
        return false;
    return true
}

/* ----- UPLOAD FILE ----- */
exports.upload = (path = '', type = '') => {
    try {
        const fileS = path.split('\\');
        const fileName = fileS[3];
        const extension = fileName.split('\.');
        const fileE = extension[1];
        switch (type) {
            case 'P':
                if (this.isPDF(fileE))
                    return fileName;
                return false;
            case 'I':
                if (this.isImage(fileE))
                    return fileName;
                return false;
            default:
                fs.unlinkSync(path);
                return false;
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}