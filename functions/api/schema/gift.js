const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    recipientName: Joi.string().required(),
    recipientEmail: Joi.string().required(),
    senderName: Joi.string().required(),
    message: Joi.string(),
    amount: Joi.number().required(),
    expiryDate: Joi.number().allow(null),
    isClaimed: Joi.boolean(),
  }),
};
