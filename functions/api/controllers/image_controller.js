const {
  CreateImageRequest,
  GetImageByIdRequest,
  FindImageRequest,
} = require("../../db/image_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const { imageRepo } = require("../../db/repo_instances")

router.post("/new", wrap(async (req) => {
  const body = req.body;
  return await imageRepo.create(new CreateImageRequest(body.isPrivate, body.contentType));
}));


router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await imageRepo.get(new GetImageByIdRequest(params.id));
}));

router.get("/", wrap(async (req) => {
  const params = req.params;
  return await imageRepo.find(new FindImageRequest(params.ids));
}));

module.exports = router;
