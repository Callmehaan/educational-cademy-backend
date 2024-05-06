const Validator = require("fastest-validator");
const joi = require("joi");

const registerValidatorSchema = joi.object({
    name: joi.string().min(3).max(255).required(),
    username: joi.string().min(3).max(100).required(),
    phone: joi.string().required(),
    email: joi.string().email().min(10).max(100).required(),
    password: joi.string().min(8).max(24).required(),
    confirmPassword: joi.ref("password"),
});

const v = new Validator();

const schema = {
    name: {
        type: "string",
        min: 3,
        max: 255,
    },
    username: {
        type: "string",
        min: 3,
        max: 100,
    },
    email: {
        type: "email",
        min: 10,
        max: 100,
    },
    phone: {
        type: "string",
    },
    password: {
        type: "string",
        min: 8,
        max: 24,
    },
    confirmPassword: {
        type: "equal",
        field: "password",
    },
    $$strict: true,
};

const check = v.compile(schema);

// module.exports = check;
module.exports = registerValidatorSchema;
