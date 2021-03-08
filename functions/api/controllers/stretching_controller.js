const {
  CreateStretchingRequest,
  UpdateStretchingRequest,
  FindStretchingRequest,
  GetStretchingByIdRequest,
} = require("../../db/stretching_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const stretchingSchema = require("../schema/stretching");

const { stretchingRepo } = require("../../db/repo_instances")
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkAdmin, validate(stretchingSchema), wrap(async (req) => {
  const body = req.body;
  return await stretchingRepo.create(req.ctx, new CreateStretchingRequest(
    body.displayName,
    body.description,
    body.isNew,
    body.priceCode,
    body.isDeleted,
  ));
}));

router.get("/", wrap(async (req) => {
  const { ids, includeDeleted } = req.query;
  return await stretchingRepo.find(req.ctx, new FindStretchingRequest(ids, includeDeleted));
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await stretchingRepo.get(req.ctx, new GetStretchingByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(stretchingSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;
  const updateReq = new UpdateStretchingRequest(
    params.id,
    body.displayName,
    body.description,
    body.isNew,
    body.priceCode,
    body.isDeleted,
  );

  return await stretchingRepo.update(req.ctx, updateReq);
}));


module.exports = router;
