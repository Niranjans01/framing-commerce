const { imageRepo } = require("../db/repo_instances");
const { DeleteImageByIdRequest } = require("../db/image_repo");

module.exports = async function (before, after) {
  before = before || [];
  after = after || [];
  const forDeletion = [];

  before.forEach(image => {
    if (after.find(i => i === image)) {
      return;
    }

    forDeletion.push(image);
  })

  console.log("Scheduling images for deletion: ", forDeletion);
  const promises = forDeletion.map(async (i) => {
    const req = new DeleteImageByIdRequest(i);
    return await imageRepo.delete(req);
  });

  await Promise.all(promises);
  console.log("Scheduling for deletion done.")
};
