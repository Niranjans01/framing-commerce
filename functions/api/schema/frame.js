const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    priceCode: fields.priceCode,
    width: Joi.number().required(),
    height: Joi.number().required(),
    rebate: Joi.number(),
    color: Joi.string().required(),
    material: Joi.string(),
    isDeleted: Joi.bool(),
    isDefault:Joi.bool(),
    isOrnate:Joi.bool(),
    horizontalBorderImage: fields.image,
    verticalBorderImage: fields.image,
    info: Joi.string()
  })
};
