const fs = require('fs')

async function populateMirror(mirrorTypes, frames, dimensions, instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/mirrors.json`)
    const conf = JSON.parse(confJson)
    conf.configurations.forEach(c => {
      if (c.name === 'dimension') {
        c.values = c.values.map(i => dimensions[i])
      }
      if (c.name === 'mirror') {
        c.values = c.values.map(i => mirrorTypes[i])
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

module.exports.populateMirror = populateMirror;
