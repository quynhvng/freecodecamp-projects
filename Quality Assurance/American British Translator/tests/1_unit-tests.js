const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const a2b = new Translator('a2b');
const b2a = new Translator('b2a');

function stripSpan(str) {
  // strip span tag to test content
  return str.replace(/<span class="highlight">|<\/span>/g, '');
}

suite('Unit Tests', () => {
  suite('American to British test', () => {
    test('1', () => {
      assert.equal(
        stripSpan(a2b.translate('Mangoes are my favorite fruit.')),
        'Mangoes are my favourite fruit.'
      );
    })

    test('2', () => {
      assert.equal(
        stripSpan(a2b.translate('I ate yogurt for breakfast.')),
        'I ate yoghurt for breakfast.'
      );
    })

    test('3', () => {
      assert.equal(
        stripSpan(a2b.translate('We had a party at my friend\'s condo.')),
        'We had a party at my friend\'s flat.'
      );
    })

    test('4', () => {
      assert.equal(
        stripSpan(a2b.translate('Can you toss this in the trashcan for me?')),
        'Can you toss this in the bin for me?'
      );
    })

    test('5', () => {
      assert.equal(
        stripSpan(a2b.translate('The parking lot was full.')),
        'The car park was full.'
      );
    })

    test('6', () => {
      assert.equal(
        stripSpan(a2b.translate('Like a high tech Rube Goldberg machine.')),
        'Like a high tech Heath Robinson device.'
      );
    })

    test('7', () => {
      assert.equal(
        stripSpan(a2b.translate('To play hooky means to skip class or work.')),
        'To bunk off means to skip class or work.'
      );
    })

    test('8', () => {
      assert.equal(
        stripSpan(a2b.translate('No Mr. Bond, I expect you to die.')),
        'No Mr Bond, I expect you to die.'
      );
    })

    test('9', () => {
      assert.equal(
        stripSpan(a2b.translate('Dr. Grosh will see you now.')),
        'Dr Grosh will see you now.'
      );
    })

    test('10', () => {
      assert.equal(
        stripSpan(a2b.translate('Lunch is at 12:15 today.')),
        'Lunch is at 12.15 today.'
      );
    })
  })
  suite('British to American tests', () => {
    test('1', () => {
      assert.equal(
        stripSpan(b2a.translate('We watched the footie match for a while.')),
        'We watched the soccer match for a while.'
      );
    })

    test('2', () => {
      assert.equal(
        stripSpan(b2a.translate('Paracetamol takes up to an hour to work.')),
        'Tylenol takes up to an hour to work.'
      );
    })

    test('3', () => {
      assert.equal(
        stripSpan(b2a.translate('First, caramelise the onions.')),
        'First, caramelize the onions.'
      );
    })

    test('4', () => {
      assert.equal(
        stripSpan(b2a.translate('I spent the bank holiday at the funfair.')),
        'I spent the public holiday at the carnival.'
      );
    })

    test('5', () => {
      assert.equal(
        stripSpan(b2a.translate('I had a bicky then went to the chippy.')),
        'I had a cookie then went to the fish-and-chip shop.'
      );
    })

    test('6', () => {
      assert.equal(
        stripSpan(b2a.translate('I\'ve just got bits and bobs in my bum bag.')),
        'I\'ve just got odds and ends in my fanny pack.'
      );
    })

    test('7', () => {
      assert.equal(
        stripSpan(b2a.translate('The car boot sale at Boxted Airfield was called off.')),
        'The swap meet at Boxted Airfield was called off.'
      );
    })

    test('8', () => {
      assert.equal(
        stripSpan(b2a.translate('Have you met Mrs Kalyani?')),
        'Have you met Mrs. Kalyani?'
      );
    })

    test('9', () => {
      assert.equal(
        stripSpan(b2a.translate('Prof Joyner of King\'s College, London.')),
        'Prof. Joyner of King\'s College, London.'
      );
    })

    test('10', () => {
      assert.equal(
        stripSpan(b2a.translate('Tea time is usually around 4 or 4.30.')),
        'Tea time is usually around 4 or 4:30.'
      );
    })
  })
  suite('Highlight tests', () => {
    const regex = /<span class="highlight">.+<\/span>/
    test('1', () => {
      assert.match(a2b.translate('Mangoes are my favorite fruit.'), regex);
    })

    test('2', () => {
      assert.match(a2b.translate('I ate yogurt for breakfast.'), regex);
    })

    test('3', () => {
      assert.match(b2a.translate('We watched the footie match for a while.'), regex);
    })

    test('4', () => {
      assert.match(b2a.translate('Paracetamol takes up to an hour to work.'), regex);
    })
  })
});
