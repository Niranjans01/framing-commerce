const fs = require('fs')

async function populateAcrylicFloat(dimensions, printing, edgeWidth, instance) {
  try {
    const confJson = fs.readFileSync(`./data/products/acrylic-float-frames.json`)
    const conf = JSON.parse(confJson)
    conf.configurations.forEach(c => {
      if (c.name === 'dimension') {
        c.values = c.values.map(i => dimensions[i])
      }
      if (c.name === 'print') {
        c.values = c.values.map(i => printing[i])
      }
      if (c.name === 'edge_width') {
        c.values = c.values.map(i => edgeWidth[i])
      }
    })

    const createdProduct = await instance.post(`product/new`, conf);

    return createdProduct

  } catch (err) {
    throw(err)
  }
}

module.exports.populateAcrylicFloat = populateAcrylicFloat;
