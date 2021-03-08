const fs = require('fs')

async function populateClipFrames(dimensions, printing, instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/clip-frames.json`)
    const conf = JSON.parse(confJson)
    conf.configurations.forEach(c => {
      if (c.name === 'dimension') {
        c.values = c.values.map(i => dimensions[i])
      }
      if (c.name === 'print') {
        c.values = c.values.map(i => printing[i])
      }
    })

    const createdProduct = await instance.post(`product/new`, conf);

    return createdProduct

  } catch (err) {
    throw(err)
  }
}

module.exports.populateClipFrames = populateClipFrames;
