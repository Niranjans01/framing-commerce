const fs = require('fs')

async function populatePictureFraming(dimensions, backing, printing, glass, mat, frames, instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/picture-framing.json`)
    const conf = JSON.parse(confJson)
    conf.configurations.forEach(c => {
      if (c.name === 'dimension') {
        c.values = c.values.map(i => dimensions[i])
      }
      if (c.name === 'backing') {
        c.values = c.values.map(i => backing[i])
      }
      if (c.name === 'print') {
        c.values = c.values.map(i => printing[i])
      }
      if (c.name === 'glass') {
        c.values = c.values.map(i => glass[i])
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

module.exports.populatePictureFraming = populatePictureFraming;
