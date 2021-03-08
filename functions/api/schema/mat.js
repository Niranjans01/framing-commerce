const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    image: fields.image,
    isDeleted: Joi.bool(),
  }),
};
