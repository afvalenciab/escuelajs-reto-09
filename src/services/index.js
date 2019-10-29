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
