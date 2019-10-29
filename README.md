# escuelajs-reto-09
Reto 9 Octubre 26: Curso de Backend con Node

## Platzi Store Backend

Ya tenemos el Backend de Platzi Store funcionando de manera local, es momento de unirlo a una base de datos en la nube con MongoDBAtlas.

### Instalación
```
npm install
```

### Ejecución
```
npm run start
```

## Documentación

### src/index.js

Archivo principal de la aplicación, en este archivo se crea el servidor Express, se realiza configuración para aceptar contenido json y se inicia el servicio para escuchar en el puerto configurado.

## routes/index.js

Archivo con la configuración de las rutas que estan habilitadas para la API, las cuales corresponden a la URL que se especifica en la barra de navegación del navegador. Este archivo cuenta con las rutas para obtener todos los productos, un solo producto, crear un producto, crear muchos productos y eliminar un producto.

```javascript
router.get('/products', async (req, res, next) => {
    try {
      const storeProducts = await productService.getProducts();
      res.status(200).json(storeProducts);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try {
      const product = await productService.getProduct({ productId });
      res.status(200).json({
        data: product,
        message: 'product retrieved'
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/add', async (req, res, next) => {
    const { body: product } = req;

    try {
      const createdProductId = await productService.createProduct({ product });
      res.status(201).json({
        data: createdProductId,
        message: 'product created'
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/addAll', async (req, res, next) => {
    const { productsList } = req.body;
    try {
      const createdProductsIds = await productService.createAllProducts({ productsList });
      res.status(200).json({
        data: createdProductsIds,
        message: 'Products created'
      });
    } catch (error) {
      next(error);
    }
  });

  router.put('/:productId', async (req, res, next) => {
    const { body: product } = req;
    const { productId } = req.params;
    console.log({product});
    try {
      const updatedproductId = await productService.updateProduct({ productId, product });
      res.status(200).json({
        data: updatedproductId,
        message: 'product updated'
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:productId', async (req, res, next) => {
    const { productId } = req.params;

    try {
      const deletedProductId = await productService.deleteProduct({ productId });
      res.status(200).json({
        data: deletedProductId,
        message: 'producr deleted'
      });
    } catch (error) {
      next(error);
    }
  });
```

### Services/index.js

Archivo que cuenta con la lógica de negocio para las funcionalidades del CRUD de un producto. Se encarga de llamar a la librearía de Mongo para obtener los datos de la base de datos.

```javascript
const MongoConnect = require('../lib/mongo');

class ProductService {
  constructor() {
    this.collection = 'products';
    this.mongoConnect = new MongoConnect();
  }

  async getProducts() {
    const products = await this.mongoConnect.getAll(this.collection);
    return products || [];
  }

  async getProduct({ productId }) {
    const product = await this.mongoConnect.get(this.collection, productId);
    return product || {};
  }

  async createProduct({ product }) {
    const createdProductId = await this.mongoConnect.create(this.collection, product);
    return createdProductId;
  }

  async createAllProducts({ productsList }) {
    let createdProductsIds = [];
    for (let i = 0; i < productsList.length; i++) {
      const createdId = await this.mongoConnect.create(this.collection, productsList[i]);
      createdProductsIds.push(createdId);
    }
    return createdProductsIds;
  }

  async updateProduct({ productId, product }) {
    const updatedProductId = await this.mongoConnect.update(this.collection, productId, product);
    return updatedProductId;
  }

  async deleteProduct({ productId }) {
    const deletedProductId = await this.mongoConnect.delete(this.collection, productId);
    return deletedProductId;
  }
}

module.exports = ProductService;
```

### lib/mongo.js

Archivo encagado de la conexión a la base de datos y exponer los metodos necesarios para crear, obtener, actualizar y eliminar un producto de la base de datos.

```javascript
getAll(collection) {
    return this.connect().then((db) => {
      return db.collection(collection).find().toArray();
    });
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    })
  }

  create(collection, data) {
    return this.connect().then((db) => {
      return db.collection(collection).insertOne(data);
    }).then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect().then((db) => {
      return db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true});
    }).then(result => result.upsertedId || id);
  }

  delete(collection, id){
    return this.connect().then((db) => {
      return db.collection(collection).deleteOne({ _id: ObjectId(id) });
    }).then(() => id);
  }
```

### test/routes.product.test.js

Archivo que cuenta con los test de la capa de rutas.

```javascript
const assert = require('assert');
const proxyquire = require('proxyquire');
const { productsMock, ProductServiceMock } = require('../src/utils/mocks/mocks');
const testServer = require('../src/utils/testServer');

describe('Routes - Products', function() {
  const route = proxyquire('../src/routes/index', {
    '../services/index': ProductServiceMock
  });

  const request = testServer(route);
  describe('GET /products', function() {

    it('Should respond with the list of products', function(done) {
      request.get('/api/products').end((err, res) => {
        assert.deepEqual(res.body, productsMock);
      });
      done();
    });

  });
});
```

### test/service.product.test.js

Archivo que cuenta con los test para la capa de servicios.

```javascript
const assert = require('assert');
const proxyquire = require('proxyquire');
const { getAllStub, MongoConnectMock } = require('../src/utils/mocks/mongoConnect');
const { productsMock } = require('../src/utils/mocks/mocks');

describe('Services - products', () => {
  const ProductsService = proxyquire('../src/services/index', {
    '../lib/mongo': MongoConnectMock
  });
  
  const productsService = new ProductsService();
  describe('when getProducts method is called', async () => {
    it('Should return an array of products', async () => {
      const result = await productsService.getProducts();
      assert.deepEqual(result, productsMock);
    });
  });
});
```

### now/json

Archivo con la configuración para el despliegue de la aplicación en NOW.

```javascript
{
  "name": "platzistore",
  "version": 2,
  "builds": [{ "src": "src/index.js", "use": "@now/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.js" }],
  "env": {
    "DB_USER": "@platzistore-db-user",
    "DB_PASSWORD": "@platzistore-db-password",
    "DB_HOST": "@platzistore-db-host",
    "DB_NAME": "@platzistore-db-name"
  }
}
```

#### URL para ingresar al API de Platzistore.

Inicio:
```
https://platzistore-api-afvalenciab.now.sh/api/
```

getProducts:
```
https://platzistore-api-afvalenciab.now.sh/api/products
````

getProduct:
```
https://platzistore-api-afvalenciab.now.sh/api/5db475ad30e6290a0c41ddf7
```

addProduct:
```
https://platzistore-api-afvalenciab.now.sh/api/add
```

addAllProducts:
```
https://platzistore-api-afvalenciab.now.sh/api/addAll
```

putProducts:
```
https://platzistore-api-afvalenciab.now.sh/api/5db475ad30e6290a0c41ddf7
```

deleteProducts:
```
https://platzistore-api-afvalenciab.now.sh/api/5db475ad30e6290a0c41ddf7
```


## Problema 1
1. Utilizando el archivo `.env-example` realiza la configuración para tu archivo `.env`.
2. Crear tu base de datos en MongoDBAtlas.
3. Verificar que la conexión de tu aplicación a MongoDBAtlas funcione.

## Problema 2
1. Subir la información del mock a MongoDBAtlas.
2. Utilizando el archivo `src/services/index.js`, cambiar la lógica de `getProducts` para obtener la información de MongoDBAtlas.
3. Exponer en la API la información de Products en `/api/products/`.

## Problema 3 (opcional)
1. Ya cuentas con el endpoint para leer todos los Products, es momento de crear un CRUD para un Product individual.
2. Realizar tests con Mocha a los endpoints, mínimo 1 al endpoint `/api/products/`.
3. Realizar el deploy de tu aplicación con Now.sh.

### Enviar solución de reto
Debes de crear un "Fork" de este proyecto, revolver los problemas y crear un Pull Request hacia este repositorio.

### Contribuir
Si alguien quiere agregar o mejorar algo, lo invito a colaborar directamente en este repositorio: [escuelajs-reto-09](https://github.com/platzi/escuelajs-reto-09/)

### Licencia
escuelajs-reto-09 se lanza bajo la licencia [MIT](https://opensource.org/licenses/MIT).
