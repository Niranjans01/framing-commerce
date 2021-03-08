const Joi = require("joi");

const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    multiplier: Joi.number().allow(null),
    prices: Joi.object().pattern(Joi.string(), Joi.number()).allow(null)
  }).or("prices", "multiplier"),
};

