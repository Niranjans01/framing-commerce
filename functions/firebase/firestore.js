const admin = require("./admin");
const firestore = admin.firestore();
firestore.settings({
  ignoreUndefinedProperties: true,
})
module.exports = firestore;
