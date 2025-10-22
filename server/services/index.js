'use strict';

const componentUsage = require('./component-usage');
const usageTracker = require('./usage-tracker');
const componentRelationships = require('./component-relationships');

module.exports = {
  'component-usage': componentUsage,
  'usage-tracker': usageTracker,
  'component-relationships': componentRelationships
};
