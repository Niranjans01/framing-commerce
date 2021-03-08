const {
  CreateMirrorRequest,
  UpdateMirrorRequest,
  FindMirrorRequest,
  GetMirrorByIdRequest,
} = require("../../db/mirror_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const mirrorSchema = require("../schema/mirror");

const { mirrorRepo } = require("../../db/repo_instances")
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkAdmin, validate(mirrorSchema), wrap(async (req) => {
  const body = req.body;
  return await mirrorRepo.create(req.ctx, new CreateMirrorRequest(
    body.displayName,
    body.description,
    body.priceCode,
    body.discount,
    body.isNew,
    body.isDeleted,
  ));
}));

router.get("/", wrap(async (req) => {
  const { ids, includeDeleted } = req.query;
  return await mirrorRepo.find(req.ctx, new FindMirrorRequest(ids, includeDeleted));
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await mirrorRepo.get(req.ctx, new GetMirrorByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(mirrorSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;
  const updateReq = new UpdateMirrorRequest(
    params.id,
    body.displayName,
    body.description,
    body.priceCode,
    body.discount,
    body.isNew,
    body.isDeleted,
  );

  return await mirrorRepo.update(req.ctx, updateReq);
}));


module.exports = router;
