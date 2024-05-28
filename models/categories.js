const { default: mongoose, Schema } = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
    },
    description: String
}, { versionKey: false });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
