const functions = require("../firebase/functions");

const handleDeletedImages = require("./image_deletion_handler");

const onMatUpdate = functions.firestore.document("mat/{id}")
  .onUpdate(async (change, context) => {
    await handleDeletedImages([change.before.data().image], [change.after.data().image]);
  });

module.exports = {
  onMatUpdate
};
