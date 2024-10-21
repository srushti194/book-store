const Joi = require("joi");

const addCartValidation = Joi.object({
  bookId: Joi.number().required(),
  quantity: Joi.number().required(),
});

module.exports = {
  addCartValidation,
};