const express = require('express');
const { addProductToCart,
    deleteProductFromCart,
    getCartList } = require('../controllers/cartControllers');

const cartRouter = express.Router();

cartRouter.post('/add/:productId', addProductToCart);

cartRouter.delete('/remove/:productId', deleteProductFromCart);

cartRouter.get('/', getCartList);

module.exports = cartRouter;