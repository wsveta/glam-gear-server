const { default: mongoose, Schema } = require("mongoose");
const Category = require('./categories');
const User = require('./users');

const productSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Children'],
        required: true
    },
    mainCategory: {
        type: String,
        enum: ['Clothing', 'Accessories', 'Footwear'],
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
    },
    size: {
        type: String,
    },
    colors: [String],
    stock: {
        type: Number,
        default: 1,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;