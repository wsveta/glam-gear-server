const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    subCategory: {
        type: String,
        required: true
    },
}, { versionKey: false });

const mainCategorySchema = new mongoose.Schema({
    mainCategory: {
        type: String,
        enum: ['Clothing', 'Footwear', 'Accessories'],
        required: true
    },
    subCategory: [subCategorySchema]
}, { versionKey: false });

const typeSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Children'],
        required: true
    },
    mainCategory: [mainCategorySchema]
}, { versionKey: false });

const Category = mongoose.model('Category', typeSchema);

module.exports = Category;
