'use strict';

const register = require('./server/register');
const bootstrap = require('./server/bootstrap');
const destroy = require('./server/destroy');
const config = require('./server/config');
const controllers = require('./server/controllers');
const routes = require('./server/routes');
const services = require('./server/services');
const contentTypes = require('./server/content-types');

module.exports = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes
};
