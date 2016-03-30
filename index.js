'use strict';

const _ = require('lodash');
const debug = require('debug')('koa-sequelize-rest');
const inflection = require('inflection');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

class Rest
{
  constructor(model, options) {
    debug(model);
    this.model = model;
    this.plural = inflection.pluralize(model.name);
    _.defaults(options, { idColumn: 'uuid' });
    this.options = options;
  }

  _getEntity(ctx, include) {
    // Check UUID format
    if (!uuidRegex.test(ctx.params[this.options.idColumn])) ctx.throw(404);

    // Fetch the entity
    return this.model.findOne({
      where: { [this.options.idColumn]: ctx.params[this.options.idColumn] },
      include
    });
  }

  getEntity(include) {
    let rest = this;

    return function* getEntity(next) {
      this.instance = yield rest._getEntity(this, include);
      debug(`Loaded ${rest.model.name} ${this.instance}`);

      yield next;
    };
  }

  create() {
    let rest = this;

    return function* create(next) {
      this.instance = yield rest.model.create(this.request.body);
      debug(`Created ${rest.model.name} ${this.instance}`);

      yield next;

      this.status = 201;
      this.body = this.instance;
    };
  }

  readOne() {
    let rest = this;

    return function* readOne(next) {
      this.instance = yield rest._getEntity(this, [{ all: true }]);

      yield next;

      this.status = 200;
      this.body = this.instance;
    };
  }

  readAll(options) {
    let rest = this;

    return function* readAll(next) {
      this.instances = yield rest.model.findAll(_.merge(this.state.where, options));

      yield next;

      this.status = 200;
      this.body = {
        [rest.plural]: this.instances
      };
    };
  }

  update(options) {
    let rest = this;

    return function* update(next) {
      this.instance = yield rest._getEntity(this, []);
      this.instance = yield this.instance.update(this.request.body, options);
      debug(`Updated ${rest.model.name} ${this.instance}`);

      yield next;

      this.status = 200;
      this.body = this.instance;
    };
  }

  delete() {
    let rest = this;

    return function* remove(next) {
      this.instance = yield rest._getEntity(this, []);
      yield this.instance.destroy();
      debug(`Deleted ${rest.model.name} ${this.instance}`);

      yield next;

      this.status = 204;
    };
  }
}

module.exports = Rest;
