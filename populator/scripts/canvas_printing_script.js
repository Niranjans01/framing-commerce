const fs = require('fs')

async function populateCanvasPrints(dimensions, printing, stretching, edge, frames, instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/canvas-printing.json`)
    const conf = JSON.parse(confJson)
    conf.configurations.forEach(c => {
      if (c.name === 'dimension') {
        c.values = c.values.map(i => dimensions[i])
      }
      if (c.name === 'print') {
        c.values = c.values.map(i => printing[i])
      }
      if (c.name === 'stretching') {
        c.values = c.values.map(i => stretching[i])
      }
      if (c.name === 'edge') {
        c.values = c.values.map(i => edge[i])
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

module.exports.populateCanvasPrints = populateCanvasPrints;
