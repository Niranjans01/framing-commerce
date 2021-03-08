const Joi = require("joi");
const { BadRequestException } = require("../requests/exceptions");

function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  let tempCoupon = object.body?object.body.couponCode:null
  if(tempCoupon){
    object.body.couponCode = object.body.couponCode.displayName
  }
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object, {
      abortEarly: false,
    });
    if(tempCoupon){
      value.body.couponCode = tempCoupon
    }
  if (error) {
    const errorMessage = error.details.map((details) => details.message);
    throw new BadRequestException(errorMessage);
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
