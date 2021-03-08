const fs = require('fs')

async function populateCorks(dimensions, backing, frames, instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/corks.json`)
    const conf = JSON.parse(confJson)
    conf.configurations.forEach(c => {
      if (c.name === 'dimension') {
        c.values = c.values.map(i => dimensions[i])
      }
      if (c.name === 'backing') {
        c.values = c.values.map(i => backing[i])
      }
      if (c.name === 'frame') {
        c.values = c.values.map(i => frames[i])
      }
    })

    const createdProduct = await instance.post(`product/new`, conf);

    return createdProduct

  } catch (err) {
    throw(err)
  }
}

module.exports.populateCorks = populateCorks;
