const fs = require("fs");

async function populateShipping(instance) {
  try {
    const confJson = fs.readFileSync(`./data/configurations/shipping.json`);
    const confs = JSON.parse(confJson);

    const promises = confs.map(async (c) =>
      instance.post(`shipping/new`, c).then((res) => res.data.shipping)
    );
    const createdConfs = await Promise.all(promises);

    return createdConfs;
  } catch (err) {
    throw err;
  }
}

module.exports.populateShipping = populateShipping;
