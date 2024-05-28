const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { addNewProduct,
    deleteProduct,
    getProducts,
    getProductById,
    updateProduct,
    getProductsByQuery,
    sortProducts } = require('../controllers/productsControllers')

const productsRouter = express.Router();

productsRouter.post('/products', authMiddleware, addNewProduct);

productsRouter.delete('/products/:productId', authMiddleware, deleteProduct);

productsRouter.get('/products', getProducts);

productsRouter.get('/products/:productId', getProductById);

productsRouter.put('/products/:productId', authMiddleware, updateProduct);

productsRouter.get('/products/search?q=query', getProductsByQuery);

productsRouter.get('/products/sort?criteria=sortBy', sortProducts);

module.exports = productsRouter;