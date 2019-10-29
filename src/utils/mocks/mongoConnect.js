const sinon = require('sinon');
const { productsMock } = require('./mocks');

const getAllStub = sinon.stub();
getAllStub.withArgs('products').resolves(productsMock);

class MongoConnectMock {
  getAll(collection) {
    return getAllStub(collection);
  }
}
module.exports = {
  MongoConnectMock,
  getAllStub
};
