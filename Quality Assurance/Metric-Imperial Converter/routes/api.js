'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  
  app
    .route('/api/convert')
    .get(function (req, res) {
      const input = req.query.input;
      let initNum, initUnit, errors = [];
      try {
        try {
          initNum = convertHandler.getNum(input);
        } catch (e) {
          errors.push(e.message);
        } finally {
          initUnit = convertHandler.getUnit(input);
        }
      } catch (e) {
        errors.push(e.message);
      } finally {
        if (errors.length == 1) res.send(errors[0]);
        if (errors.length == 2) res.send('invalid number and unit');
      }
      const converted = convertHandler.convert(initNum, initUnit);
      const returnNum = converted.returnNum;
      const returnUnit = converted.returnUnit;
      const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      const result = {
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string
      };
      res.json(result);
    })
};
