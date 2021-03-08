const fs = require("fs");

async function populateFaq(instance) {
  try {
    const confJson = fs.readFileSync(`./data/faq.json`);
    const confs = JSON.parse(confJson);

    const promises = confs.map(async (c) =>
      instance.post(`faq/new`, c).then((res) => res.data.faq)
    );
    const createdConfs = await Promise.all(promises);

    return createdConfs;
  } catch (err) {
    throw err;
  }
}

module.exports.populateFaq = populateFaq;
