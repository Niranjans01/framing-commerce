const Joi = require("joi");
const { fields } = require("./common");


const configuration = Joi.object({
  type: Joi.string(),
  value: Joi.any(),
  displayName: Joi.string(),

})

module.exports = {
  body: Joi.object({
    id: fields.id,
    items: Joi.array().items(Joi.object({
      displayName: Joi.string(),
      product: fields.id,
      quantity: Joi.number(),
      price: Joi.number().allow(null),
      configurations: Joi.array().items(configuration).allow(null),
      variant: Joi.object({
        name: Joi.string(),
        price: Joi.number()
      }),
      image: Joi.string().allow(null)//fields.images,
    }).or("variant", "configurations")),
    isPaid: Joi.bool(),
    isShipped: Joi.bool(),
    paymentProvider: Joi.string().valid("eway", "afterpay"),
    deliveryCharges: Joi.number().allow(null),
    couponCode: Joi.string().allow(null),
    giftCode: Joi.string().allow(null),
    orderTotal: Joi.number().allow(null),
    owner: Joi.string(),
    shippingAddress: Joi.object(),
    billingAddress: Joi.object(),
    transactionId: Joi.string().allow(null, ""),
    trackingNumber: Joi.string().allow(null, ""),
  }),
};
