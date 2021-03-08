const Joi = require("joi");
const { fields } = require("./common");

module.exports = {
    body: Joi.object({
        test_search: Joi.string()
    })
};
