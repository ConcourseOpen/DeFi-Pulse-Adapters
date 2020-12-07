/*==================================================
  Modules
  ==================================================*/

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
  ]

/*==================================================
  Test
  ==================================================*/

  _.each(args.projects, (project) => {
    describe(`${project.slug} project export format`, () => {
      it('has a valid name', () => {
        chai.assert.isString(project.name);
      });
      it('category matches one of the defined options', () => {
        chai.expect(project.category).to.be.oneOf(categories);
      });
      it('has a valid start time', () => {
        chai.expect(project.start).to.be.at.most(moment().utcOffset(0).unix(), 'unix start time must be less than the current time')
      });
      if(project.tvl && project.rates) {
        it('has a valid tvl method', () => {
          chai.assert.isFunction(project.tvl);
        });
        it('has a valid rates method', () => {
          chai.assert.isFunction(project.rates);
        });
      } else {
        it('has a valid tvl or rates method', () => {
          chai.assert.isFunction(project.tvl || project.rates);
        });
      }
    });
  });

