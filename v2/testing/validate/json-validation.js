const _ = require('underscore');
const chai = require('chai');
const moment = require('moment');
const sdk = require('../../../sdk');

const args = require('../args');
const categories = [
  'Derivatives',
  'DEXes',
  'Lending',
  'Payments',
  'Assets'
];

_.each(args.projects, (projectAdapter) => {
  describe(`Checking ${projectAdapter.name} project adapter metadata`, () => {
    it('has a valid name', () => {
      chai.assert.isString(projectAdapter.name);
    });

    it('has a valid start time', () => {
      chai.expect(projectAdapter.start).to.be.at.most(moment().utcOffset(0).unix(), 'unix start time must be less than the current time')
    });

    it('category matches one of the defined categories', () => {
      chai.expect(projectAdapter.category).to.be.oneOf(categories);
    });

    describe('has valid tokenHolderMap configurations', () => {
      it('tokenHolderMap is an array', () => {
        chai.assert.isArray(projectAdapter.tokenHolderMap);
      });

      it('tokenHolderMap has valid token configurations', () => {
        projectAdapter.tokenHolderMap.forEach((thm) => {
          chai.expect(thm.tokens).to.satisfy((tokens) => {
            if (sdk.api.util.isCallable(tokens)) {
              return true;
            } else if (sdk.api.util.isString(tokens) || Array.isArray(tokens)) {
              return tokens.length > 0;
            } else if (tokens.pullFromPools) {
              return !!tokens.abi;
            }
          });
        });
      });

      it('tokenHolderMap has valid holder/vault/pool configurations', () => {
        projectAdapter.tokenHolderMap.forEach((thm) => {
          chai.expect(thm.holders).to.satisfy((holders) => {
            if (sdk.api.util.isCallable(holders)) {
              return true;
            } else if (sdk.api.util.isString(holders) || Array.isArray(holders)) {
              return holders.length > 0;
            } else if (holders.pullFromLogs) {
              return !!holders.logConfig;
            }
          });
        });
      });
    });
  });
});

