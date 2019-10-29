const express = require('express');
const path = require('path');
const ProductService = require('../services/index');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

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

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;