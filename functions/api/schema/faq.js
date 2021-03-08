const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
    body: Joi.object({
        id: fields.id,
        displayName: Joi.string().required(),
        description: Joi.string().required(),
        isDeleted: Joi.boolean()
    })
};
