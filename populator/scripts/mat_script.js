const fs = require('fs')

async function populateMat(priceCode, instance) {
  try {
    const confJson = fs.readFileSync(`./data/configurations/mat.json`)
    const confs = JSON.parse(confJson)
    confs.map(c => {
      if (c.priceCode) {
        c.priceCode = priceCode[c.priceCode]
      }
    })

    const promises = confs.map(async c => instance.post(`mat/new`, c).then(res => res.data.mat))
    const createdConfs = await Promise.all(promises);

    const result = {};
    createdConfs.forEach(c => result[c.displayName] = c.id);

    return result;

  } catch (err) {
    throw(err)
  }
}

module.exports.populateMat = populateMat;
