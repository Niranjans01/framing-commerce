const functions = require("../firebase/functions");

const handleDeletedImages = require("./image_deletion_handler");

const onPortfolioUpdate = functions.firestore.document("portfolio/{id}")
  .onUpdate(async (change, context) => {
    await handleDeletedImages([change.before.data().image], [change.after.data().image]);
  });

module.exports = {
  onPortfolioUpdate
};
