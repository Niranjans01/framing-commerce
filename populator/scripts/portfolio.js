const fs = require("fs");

async function populatePortfolio(instance) {
  try {
    const confJson = fs.readFileSync(`./data/portfolio.json`);
    const confs = JSON.parse(confJson);

    const promises = confs.map(async (c) =>
      instance.post(`portfolio/new`, c).then((res) => res.data.portfolio)
    );
    const createdConfs = await Promise.all(promises);

    return createdConfs;
  } catch (err) {
    throw err;
  }
}

module.exports.populatePortfolio = populatePortfolio;
