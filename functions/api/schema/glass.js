const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    description: Joi.string().required(),
    discount: fields.discount,
    isNew: Joi.boolean(),
    isDeleted: Joi.boolean(),
    priceCode: fields.priceCode,
    isDefault: Joi.boolean()
  }),
};
