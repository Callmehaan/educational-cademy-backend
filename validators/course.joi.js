const joi = require("joi");

const courseValidatorSchema = joi.object({
    name: joi.string().min(10).max(60).required(),
    describtion: joi.string().min(90).required(),
    support: joi.string().required(),
    href: joi.string().required(),
    price: joi.string().required(),
    status: joi.string().required(),
    discount: joi.string().required(),
    categoryID: joi.string().required(),
});

module.exports = courseValidatorSchema;
