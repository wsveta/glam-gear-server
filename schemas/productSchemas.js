const Joi = require('joi');

const addProductSchema = Joi.object({
    gender: Joi.string().valid('Male', 'Female', 'Children').required(),
    mainCategory: Joi.string().valid('Clothing', 'Accessories', 'Footwear').required(),
    subCategory: Joi.string().required(),
    name: Joi.string().max(30, 'utf8').required(),
    description: Joi.string().max(300, 'utf8').required(),
    price: Joi.number().required(),
    sizes: Joi.string().valid('xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'),
    colors: Joi.array().items(Joi.string()),
    stock: Joi.number().required()
});

const updateProductSchema = Joi.object({
    gender: Joi.string().valid('Male', 'Female', 'Children'),
    name: Joi.string().max(30, 'utf8'),
    description: Joi.string().max(300, 'utf8'),
    price: Joi.number(),
    sizes: Joi.string().valid('xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'),
    colors: Joi.array().items(Joi.string()),
    stock: Joi.number(),
});

module.exports = {
    addProductSchema,
    updateProductSchema
};
