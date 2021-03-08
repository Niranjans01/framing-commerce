const functions = require("../firebase/functions");

const handleDeletedImages = require("./image_deletion_handler");

const onProductUpdate = functions.firestore.document("product/{id}")
  .onUpdate(async (change, context) => {
    console.log("auth: ", context.auth);
    console.log("authType: ", context.authType);
    await handleDeletedImages(change.before.data().images, change.after.data().images);
  });

module.exports = {
  onProductUpdate
};
