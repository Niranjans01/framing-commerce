const Joi = require("joi");

const id = Joi.string();
const image = id;

module.exports = {
  fields: {
    id,
    image,
    images: Joi.array().items(image).allow(null),
    priceCode: id.allow(null),
    discount: Joi.number().min(0).max(100)
  },
}
