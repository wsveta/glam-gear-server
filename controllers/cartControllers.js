const Cart = require('../models/cart');
const Product = require('../models/products');

const addProductToCart = async (req, res, next) => {
    const { productId } = req.params;
    const { id } = req.user;
    const amount = Number(req.query.amount);

    try {
        const product = await Product.findById({ _id: productId });

        if (product.owner.equals(id)) {
            return res.status(400).send({ message: "You can't buy your own product" });
        }
        if (!amount) {
            return res.status(400).send({ message: "Add at least 1 product" });
        }

        let cart = await Cart.findOne({ productId });
        if (cart) {
            if (cart.amount + amount > product.stock || product.stock < amount) {
                return res.status(400).send({ message: "No more products left" });
            }
            cart = await Cart.findOneAndUpdate({ productId }, { amount: cart.amount + amount }, { new: true });
        } else {
            cart = await Cart.create({ addedBy: id, productId, amount });
        }
        res.status(200).send(cart);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

const deleteProductFromCart = async (req, res, next) => {
    const { productId } = req.params;
    const { id } = req.user;

    try {
        const cart = await Cart.findOne({ productId, addedBy: id });

        if (!cart) {
            return res.status(404).send({ message: "Not found" });
        }

        await Cart.findOneAndDelete({ productId, addedBy: id });

        res.status(200).send({ message: "Product deleted" });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

const getCartList = async (req, res, next) => {
    const { id } = req.user;

    try {
        const cart = await Cart.find({ addedBy: id }).populate('addedBy').populate('productId');

        if (!cart) {
            return res.status(404).send('No products in cart');
        }

        res.status(200).send(cart);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

module.exports = {
    addProductToCart,
    deleteProductFromCart,
    getCartList
}
