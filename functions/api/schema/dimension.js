const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    height: Joi.number().allow(null),
    width: Joi.number().allow(null),
    minimumHeight: Joi.number().allow(null),
    minimumWidth: Joi.number().allow(null),
    maximumHeight: Joi.number().allow(null),
    maximumWidth: Joi.number().allow(null),
    isCustom: Joi.boolean(),
    priceCode: fields.priceCode,
    isDeleted: Joi.bool(),
    isDefault:Joi.bool(),
  }),
};
