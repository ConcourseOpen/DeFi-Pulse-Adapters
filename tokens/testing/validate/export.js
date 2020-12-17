const _ = require('underscore');
const chai = require('chai');
const moment = require('moment');

const args = require('../args');
const types = [
  'hybrid',
  'custodial',
  'synthetic',
  'decentralized',
];

_.each(args.tokens, (tokenAdapter) => {
  describe(`${tokenAdapter.token} token adapter export format`, () => {
    it('has a valid name', () => {
      chai.assert.isString(tokenAdapter.name);
    });

    it('has a valid symbol', () => {
      chai.assert.isString(tokenAdapter.symbol);
    });

    it('has a valid start time', () => {
      chai.expect(tokenAdapter.start).to.be.at.most(moment().utcOffset(0).unix(), 'unix start time must be less than the current time')
    });

    it('has a valid balance method', () => {
      chai.assert.isFunction(tokenAdapter.balance);
    });

    it('type matches one of the defined types', () => {
      chai.expect(tokenAdapter.type).to.be.oneOf(types);
    });
  });
});

