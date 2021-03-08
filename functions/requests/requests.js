const { BadRequestException } = require("./exceptions");

function check(condition, msg) {
  if (!condition) {
    throw new BadRequestException(msg);
  }
}

function checkInstance(value, field, expectedType) {
  if (value) {
    const actualType = typeof value;
    if (expectedType !== "array") {
      check(
        actualType === expectedType,
        `Expecting a '${expectedType}' but got '${actualType}' for field '${field}'.`
      );
    } else {
      const isArray = Array.isArray(value);
      check(
        isArray,
        `Expecting an array but got '${actualType}' for field '${field}'.`
      );
    }
  }
  return value;
}

module.exports = {
  check,
  checkInstance,
};
