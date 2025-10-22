'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/components',
    handler: 'component-usage.indexFast', // Use tracker-based fast endpoint
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/components/full',
    handler: 'component-usage.index', // Legacy full data endpoint
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/components/:uid/usage',
    handler: 'component-usage.show', // Get usage from tracker
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/components-list',
    handler: 'component-usage.getComponents',
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'DELETE',
    path: '/components/:uid',
    handler: 'component-usage.delete',
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/cache/clear',
    handler: 'component-usage.clearCache', // Clear cache and recalculate
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/recalculate',
    handler: 'component-usage.recalculate', // Manually trigger recalculation
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/components/:uid/relationships',
    handler: 'component-usage.getRelationships', // Get component-to-component relationships
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/components/:uid/total-usage',
    handler: 'component-usage.getTotalUsage', // Get direct + indirect usage
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/dependency-graph',
    handler: 'component-usage.getDependencyGraph', // Get full dependency graph
    config: {
      policies: [],
      auth: false
    }
  }
];
