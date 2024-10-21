const Joi = require("joi");

const placeOrderValidation = Joi.object({
    cartId: Joi.number().required(),
    paymentType: Joi.string().required(),
});

module.exports = {
    placeOrderValidation,
};