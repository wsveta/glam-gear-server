const express = require('express');
const { addProductToCart,
    deleteProductFromCart,
    getCartList } = require('../controllers/cartControllers');

const cartRouter = express.Router();

cartRouter.post('/cart/add/:productId', addProductToCart);

cartRouter.delete('/cart/remove/:productId', deleteProductFromCart);

cartRouter.get('/cart', getCartList);

module.exports = cartRouter;