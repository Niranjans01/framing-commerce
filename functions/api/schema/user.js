const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    firstName: Joi.string(),
    lastName: Joi.string(),
    isDeleted: Joi.boolean().allow(null),
    shippingAddress: Joi.array().allow(null),
    phoneNumber: Joi.string().allow(null),
    isSubscribed: Joi.boolean().allow(null),
  }),
};
