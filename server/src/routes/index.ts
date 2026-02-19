export const routes = [
  {
    method: 'GET',
    path: '/components',
    handler: 'component-usage.indexFast',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/components/full',
    handler: 'component-usage.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/components/:uid/usage',
    handler: 'component-usage.show',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/components-list',
    handler: 'component-usage.getComponents',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/components/:uid',
    handler: 'component-usage.delete',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/cache/clear',
    handler: 'component-usage.clearCache',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/recalculate',
    handler: 'component-usage.recalculate',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/components/:uid/relationships',
    handler: 'component-usage.getRelationships',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/components/:uid/total-usage',
    handler: 'component-usage.getTotalUsage',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/dependency-graph',
    handler: 'component-usage.getDependencyGraph',
    config: {
      policies: [],
      auth: false,
    },
  },
];
