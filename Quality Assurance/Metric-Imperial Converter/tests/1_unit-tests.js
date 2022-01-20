const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  suite('Getting number', function () {
    const message = 'Expected a number';
    // #1
    test('Whole number input', function () {
      assert.strictEqual(convertHandler.getNum('1km'), 1, message);
    });
    // #2
    test('Decimal number input', function () {
      assert.strictEqual(convertHandler.getNum('1.0km'), 1, message);
      assert.strictEqual(convertHandler.getNum('1.2km'), 1.2, message);
      assert.strictEqual(convertHandler.getNum('31.23450km'), 31.2345, message);
    });
    // #3
    test('Fractional input', function () {
      assert.strictEqual(convertHandler.getNum('1/2km'), 0.5, message);
      assert.strictEqual(convertHandler.getNum('10/20km'), 0.5, message);
    });
    // #4
    test('Fractional input with decimal', function () {
      assert.strictEqual(convertHandler.getNum('2.5/5km'), 0.5, message);
      assert.strictEqual(convertHandler.getNum('10.5/10.5km'), 1, message);
      assert.strictEqual(convertHandler.getNum('1/0.5km'), 2, message);
    });
    // #5
    test('Double fraction', function () {
      assert.throws(() => {convertHandler.getNum('3/2/3km')});
      assert.throws(() => {convertHandler.getNum('33.35/22.55/53.51km')});
    });
    // #6
    test('No numerical input', function () {
      assert.strictEqual(convertHandler.getNum('km'), 1, message);
    });
  });
  suite('Getting unit', function () {
    const message = 'Expected a string';
    // #7
    test('Valid input unit', function () {
      assert.strictEqual(convertHandler.getUnit('1km'), 'km', message);
      assert.strictEqual(convertHandler.getUnit('1mi'), 'mi', message);
      assert.strictEqual(convertHandler.getUnit('1kg'), 'kg', message);
      assert.strictEqual(convertHandler.getUnit('1lbs'), 'lbs', message);
      assert.strictEqual(convertHandler.getUnit('1l'), 'L', message);
      assert.strictEqual(convertHandler.getUnit('1gal'), 'gal', message);
      assert.strictEqual(convertHandler.getUnit('100Km'), 'km', message);
      assert.strictEqual(convertHandler.getUnit('10.22KM'), 'km', message);
      assert.strictEqual(convertHandler.getUnit('12.33/5.33km'), 'km', message);
      assert.strictEqual(convertHandler.getUnit('km'), 'km', message);
    });
    // #8
    test('Invalid input unit', function () {
      assert.throws(() => {convertHandler.getUnit('10.55/32.33')});
      assert.throws(() => {convertHandler.getUnit('cm')});
      assert.throws(() => {convertHandler.getUnit('1cm')});
      assert.throws(() => {convertHandler.getUnit('10.55/33.22cm')});
    });
  });
  suite('Getting return unit', function () {
    const message = 'Wrong return unit';
    // #9
    test('Valid input unit', function () {
      assert.strictEqual(convertHandler.getReturnUnit('km'), 'mi', message);
      assert.strictEqual(convertHandler.getReturnUnit('mi'), 'km', message);
      assert.strictEqual(convertHandler.getReturnUnit('kg'), 'lbs', message);
      assert.strictEqual(convertHandler.getReturnUnit('lbs'), 'kg', message);
      assert.strictEqual(convertHandler.getReturnUnit('l'), 'gal', message);
      assert.strictEqual(convertHandler.getReturnUnit('gal'), 'L', message);
      assert.strictEqual(convertHandler.getReturnUnit('GaL'), 'L', message);
    });
  });
  suite('Spell out unit', function () {
    const message = 'Wrong spelt out unit';
    // #10
    test('Valid input unit', function () {
      assert.strictEqual(convertHandler.spellOutUnit('km'), 'kilometer', message);
      assert.strictEqual(convertHandler.spellOutUnit('mi'), 'mile', message);
      assert.strictEqual(convertHandler.spellOutUnit('kg'), 'kilogram', message);
      assert.strictEqual(convertHandler.spellOutUnit('lbs'), 'pound', message);
      assert.strictEqual(convertHandler.spellOutUnit('l'), 'liter', message);
      assert.strictEqual(convertHandler.spellOutUnit('gal'), 'gallon', message);
      assert.strictEqual(convertHandler.spellOutUnit('GaL'), 'gallon', message);
    });
  });
  suite('Conversion tests', function () {
    const message = 'Wrong conversion result';
    // #11
    test('Gal to l', function () {
      assert.deepEqual(convertHandler.convert(1, 'gal'), { returnNum: 3.78541, returnUnit: 'L'}, message);
    });
    // #12
    test('L to gal', function () {
      assert.deepEqual(convertHandler.convert(1, 'l'), { returnNum: 0.26417, returnUnit: 'gal'}, message);
    });
    // #13
    test('Mi to km', function () {
      assert.deepEqual(convertHandler.convert(1, 'mi'), { returnNum:  1.60934, returnUnit: 'km'}, message);
    });
    // #14
    test('Km to mi', function () {
      assert.deepEqual(convertHandler.convert(1, 'km'), { returnNum: 0.62137, returnUnit: 'mi'}, message);
    });
    // #15
    test('Lbs to kg', function () {
      assert.deepEqual(convertHandler.convert(1, 'lbs'), { returnNum: 0.45359, returnUnit: 'kg'}, message);
    });
    // #16
    test('Kg to lbs', function () {
      assert.deepEqual(convertHandler.convert(1, 'kg'), { returnNum: 2.20462, returnUnit: 'lbs'}, message);
    });
  });
});