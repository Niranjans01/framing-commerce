const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    fee: Joi.number().required(),
    zip: Joi.number().required(),
  }),
};
