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

// Маршрути зі статичними шляхами
productsRouter.get('/search', getProductsByQuery);  // Раніше було productsRouter.get('/search?q=query', getProductsByQuery);
productsRouter.get('/sort', sortProducts);  // Раніше було productsRouter.get('/sort?criteria=sortBy', sortProducts);

// Додаємо новий продукт
productsRouter.post('/', authMiddleware, addNewProduct);

// Отримання всіх продуктів
productsRouter.get('/', getProducts);

// Маршрути з динамічними сегментами
productsRouter.get('/:productId', getProductById);
productsRouter.put('/:productId', authMiddleware, updateProduct);
productsRouter.delete('/:productId', authMiddleware, deleteProduct);

module.exports = productsRouter;