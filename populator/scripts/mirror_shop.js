const fs = require('fs')

async function populateMirrorShop(instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/mirror-shop.json`)
    const confs = JSON.parse(confJson)


    const promises = confs.map(async c => instance.post(`product/new`, c).then(res => res.data.product))
    const createdConfs = await Promise.all(promises);

    const result = {};
    createdConfs.forEach(c => result[c.displayName] = c.id);

    return result;

  } catch (err) {
    throw (err)
  }
}

module.exports.populateMirrorShop = populateMirrorShop;
