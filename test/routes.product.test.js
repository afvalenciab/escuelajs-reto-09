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
