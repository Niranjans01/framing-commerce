const functions = require("../firebase/functions");

const handleDeletedImages = require("./image_deletion_handler");

const onEdgeUpdate = functions.firestore.document("edge/{id}")
  .onUpdate(async (change, context) => {
    await handleDeletedImages(change.before.data().images, change.after.data().images);
  });

module.exports = {
  onEdgeUpdate
};
