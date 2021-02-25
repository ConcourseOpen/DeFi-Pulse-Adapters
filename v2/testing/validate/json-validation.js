const _ = require('underscore');
const chai = require('chai');
const moment = require('moment');

const args = require('../args');
const categories = [
  'derivatives',
  'dexes',
  'lending',
  'payments',
  'assets'
];

_.each(args.projects, (projectAdapter) => {
  describe(`${projectAdapter.token} project adapter export format`, () => {
    it('has a valid name', () => {
      chai.assert.isString(projectAdapter.name);
    });

    it('has a valid start time', () => {
      chai.expect(projectAdapter.start).to.be.at.most(moment().utcOffset(0).unix(), 'unix start time must be less than the current time')
    });

    it('category matches one of the defined categories', () => {
      chai.expect(projectAdapter.category).to.be.oneOf(categories);
    });

    it('has a valid tokenHolderMap data', () => {
      chai.assert.isArray(projectAdapter.tokenHolderMap);
      projectAdapter.tokenHolderMap.forEach((thm) => {
        chai.expect(thm.tokens).to.satisfy((tokens) => {
          return tokens.length > 0;
        });

        if (thm.abi) {
          chai.assert.isString(thm.abi);
        }

        if (thm.holders) {
          chai.expect(thm.holders).to.satisfy((holders) => {
            return holders.length > 0;
          });
        }
      });
    });
  });
});

