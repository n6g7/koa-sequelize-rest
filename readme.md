# koa-sequelize-rest

Generates REST middlewares for [Sequelize](http://docs.sequelizejs.com/en/latest/) models.

## Examples

### Simple setup

```js
let koa = require('koa');
let Rest = require('koa-sequelize-rest');

let app = koa();

let Model = require('./model');
let ModelRest = new Rest(Model);

app.use(ModelRest.readAll());
```

Returns
```json
{
  "model": [
    { "value": "A" },
    { "value": "B" },
    { "value": "C" }
  ]
}
```

### Router example

koa-sequelize-rest is especially handy when used alongside [koa-router](https://github.com/alexmingoia/koa-router) :

```js
let router = koaRouter();

router.get('/', ModelRest.readAll());
router.post('/', ModelRest.create());
router.get('/:uuid', ModelRest.readOne());
router.put('/:uuid', ModelRest.update());
router.delete('/:uuid', ModelRest.delete());

app.use(router.routes());
app.use(router.allowedMethods());
```

## API

### `new Rest(model)`
Instanciate a new koa-sequelize-rest helper instance.

#### Signature
 - (param) `model`, a Sequelize model
 - (returns) `rest`, a Rest instance tied to `model`

### `rest.getEntity(includes)`
Loads a `model` instance in Koa's context `state`.

#### Signature
 - (param) `includes`
 - (returns) a *generator*

### `rest.readOne()`
Fetches a `model` instance and returns it in the response.

#### Signature
 - (returns) a *generator*

### `rest.readAll(options)`
Fetches a bunch of `model` instances and returns them in the response.

#### Signature
 - (param) `options`, a javascript object passed on to Sequelize's [`instance.findAll`](http://docs.sequelizejs.com/en/latest/api/model/#findalloptions-promisearrayinstance)
 - (returns) a *generator*

### `rest.create()`
Creates and saves a new instance of `model`, then returns the newly created instance in the response.

#### Signature
 - (returns) a *generator*

### `rest.update(options)`
Updates an instance of `model`, then returns the updated instance in the response.

#### Signature
 - (param) `options`, a javascript object passed on to Sequelize's [`instance.update`](http://docs.sequelizejs.com/en/latest/api/instance/#updateupdates-options-promisethis)
 - (returns) a *generator*

### `rest.delete()`
Deletes an instance of `model`.

#### Signature
 - (returns) a *generator*

## License

MIT
