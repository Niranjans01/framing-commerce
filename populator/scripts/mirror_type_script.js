const fs = require('fs')

async function populateMirrorType(priceCode, instance) {
  try {
    const confJson = fs.readFileSync(`./data/configurations/mirror-type.json`)
    const confs = JSON.parse(confJson)
    confs.map(c => {
      if (c.priceCode) {
        c.priceCode = priceCode[c.priceCode]
      }
    })

    const promises = confs.map(async c => instance.post(`mirror/new`, c).then(res => res.data.mirror))
    const createdConfs = await Promise.all(promises);

    const result = {};
    createdConfs.forEach(c => result[c.displayName] = c.id);

    return result;

  } catch (err) {
    throw(err)
  }
}

module.exports.populateMirrorType = populateMirrorType;
