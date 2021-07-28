const _ = require('underscore');
const chai = require('chai');
const moment = require('moment');

const args = require('../args');
const categories = [
  'Pooled',
  'Custodial',
];

_.each(args.projects, (stakingAdapter) => {
  describe(`Checking ${stakingAdapter.name} project adapter metadata`, () => {
    it('has a valid name', () => {
      chai.assert.isString(stakingAdapter.name);
    });

    it('has a valid start time', () => {
      chai.expect(stakingAdapter.start).to.be.at.most(moment().utcOffset(0).unix(), 'unix start time must be less than the current time')
    });

    it('category matches one of the defined categories', () => {
      chai.expect(stakingAdapter.category).to.be.oneOf(categories);
    });

    it('has a valid staking address', () => {
      chai.assert.isString(stakingAdapter.symbol);
    });
  });
});
