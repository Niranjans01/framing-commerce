const Joi = require("joi");
const {fields} = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    description: Joi.string().required(),
    discount: fields.discount,
    priceCode: fields.priceCode,
    isNew: Joi.boolean(),
    isDeleted: Joi.boolean(),
    isDefault: Joi.boolean()
  }),
};
