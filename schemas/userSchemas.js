const Joi = require('joi');

const userRegisterSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required()
});

const userLoginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required()
});

const emailSchema = Joi.object({
    email: Joi.string().required()
});

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    emailSchema
}