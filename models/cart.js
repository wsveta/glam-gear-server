const { default: mongoose, Schema } = require("mongoose");
const Product = require('./products');
const User = require('./users');

const cartSchema = new mongoose.Schema({
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    amount: {
        type: Number,
        default: 0
    }
}, {versionKey: false});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;