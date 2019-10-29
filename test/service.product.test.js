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