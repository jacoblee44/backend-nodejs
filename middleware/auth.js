var common = require('../Model/common.js');
var jwt = require('jsonwebtoken');

let key = process.env.SecretKey;

module.exports = (req, res, next) => {
  var resdata = {
    status: false,
    data: {},
    message: ''
  };

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = common.validateJwt(token);
      const userid = decodedToken.userid;
      const email = decodedToken.email;
      if (userid || email) {
        req.user = decodedToken;
        next();
      }
    } else {
      res.message = 'Please give token';
      res.status(401).json(resdata);
    }
  } catch {
    res.message = new Error('Invalid request');
    res.status(401).json(resdata);
  }
};