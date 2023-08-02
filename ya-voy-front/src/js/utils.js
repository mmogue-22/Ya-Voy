'use strict'

export const verify = (data = {}) => {
    const keys = Object.keys(data);
    let msg = '';
    for (const key of keys) {
        if (data[key] !== null &&
            data[key] !== undefined &&
            data[key] !== '') continue
        msg += ` ${key},`;
    }
    if (msg != '')
        msg += ' are required.'
    return msg.trim();
}

export const getHeaders = (type = '') => {
    let headers;
    switch (type) {
        case 'file':
            headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': (localStorage.getItem('IN6AV') ? localStorage.getItem('IN6AV') : sessionStorage.getItem('IN6AV'))
            }
            break;

        default:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': (localStorage.getItem('IN6AV') ? localStorage.getItem('IN6AV') : sessionStorage.getItem('IN6AV'))
            }
            break;
    }
    return headers;
}