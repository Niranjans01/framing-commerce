const fs = require('fs')

async function populateDimension(instance) {
  try {
    const confJson = fs.readFileSync(`./data/configurations/dimension.json`)
    const confs = JSON.parse(confJson)

    const promises = confs.map(async c => instance.post(`dimension/new`, c).then(res => res.data.dimension))
    const createdConfs = await Promise.all(promises);

    const result = {};
    createdConfs.forEach(c => result[c.displayName] = c.id);

    return result;

  } catch (err) {
    throw(err)
  }
}

module.exports.populateDimension = populateDimension;
