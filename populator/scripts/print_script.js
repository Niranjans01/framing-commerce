const fs = require('fs')

async function populatePrint(priceCode, instance) {
  try {
    const confJson = fs.readFileSync(`./data/configurations/print.json`)
    const confs = JSON.parse(confJson)
    confs.map(c => {
      if (c.priceCode) {
        c.priceCode = priceCode[c.priceCode]
      }
    })

    const promises = confs.map(async c => instance.post(`print/new`, c).then(res => res.data.print))
    const createdConfs = await Promise.all(promises);

    const result = {};
    createdConfs.forEach(c => result[c.displayName] = c.id);

    return result;

  } catch (err) {
    throw(err)
  }
}

module.exports.populatePrint = populatePrint;
