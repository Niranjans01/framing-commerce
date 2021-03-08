const fs = require('fs')

async function populatePriceCode(instance) {
  try {
    const pricecodeJson = fs.readFileSync('./data/price-code.json')
    const pricecode = JSON.parse(pricecodeJson)

    const promises = pricecode.map(async pc => instance.post(`price-code/new`, pc).then(res => res.data.priceCode))
    const createdPriceCodes = await Promise.all(promises);
    const result = {};

    createdPriceCodes.forEach(pc => result[pc.displayName] = pc.id);

    return result;

  } catch(err) {
    throw err;
  }
}

module.exports.populatePriceCode = populatePriceCode;
