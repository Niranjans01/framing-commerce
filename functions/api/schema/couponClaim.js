const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
    body: Joi.object({
        id: fields.id,
        couponId: Joi.string().required()
    }),
};
