const Joi = require("joi");
const { fields } = require("./common");

const configuration = Joi.object({
  name: Joi.string().valid(
    "backing",
    "dimension",
    "edge",
    "edge_width",
    "frame",
    "glass",
    "image",
    "mat",
    "mirror",
    "print",
    "stretching",
  ),
  values: Joi.array().items(fields.id).allow(null),
});

const variant = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  isDeleted: Joi.bool(),
});

module.exports = {
  body: Joi.object({
    id: fields.id,
    displayName: Joi.string().required(),
    discount: fields.discount,
    isNew: Joi.bool(),
    category: Joi.string().allow(null),
    tags: Joi.array().items(Joi.string()),
    configurations: Joi.array().items(configuration).allow(null),
    variants: Joi.array().items(variant).min(1).allow(null),
    images: fields.images,
    defaultImg:Joi.string().allow(null,""),
    description: Joi.string().allow(null, ""),
    isFeatured: Joi.bool(),
    isDeleted: Joi.bool(),
  }).or("configurations", "variants")
};
