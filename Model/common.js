require('../dbconfig');

var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const querystring = require('querystring');
var CryptoJS = require("crypto-js");

let key = process.env.SecretKey;

module.exports = {
    generateJwt : function(payload) {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        payload.exp = parseInt(expiry.getTime() / 1000);
        return jwt.sign(payload, process.env.JWT_SECRET);
    },
    validateJwt : function(token) {
        try {
            var decoded = jwt.decode(token);
            return decoded;
        } catch(err) {
            return "error";
        }
    }
}

module.exports.encryptUsingAES256 = (data) => {

    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });


    return encrypted.toString();
}

module.exports.decryptUsingAES256 = (data) => {
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(key);

    return CryptoJS.AES.decrypt(
        data, _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
}

module.exports.encryptUserNametoQueryString = (data) => {
    var username = { key: this.encryptUsingAES256(data) };
    return querystring.stringify(username);
}

