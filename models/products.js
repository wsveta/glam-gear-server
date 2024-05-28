const { default: mongoose, Schema } = require("mongoose");

const productSchema = new Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    images: [String],
    sizes: [String],
    colors: [String],
    stock: {
        type: Number,
        default: 0,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;