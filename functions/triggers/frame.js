const functions = require("../firebase/functions");

const handleDeletedImages = require("./image_deletion_handler");

const onFrameUpdate = functions.firestore.document("frames/{id}")
  .onUpdate(async (change, context) => {
    await handleDeletedImages([change.before.data().horizontalBorderImage], [change.after.data().horizontalBorderImage]);
    await handleDeletedImages([change.before.data().verticalBorderImage], [change.after.data().verticalBorderImage]);
  });

module.exports = {
  onFrameUpdate
};
