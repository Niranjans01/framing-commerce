const {
  CreateMatRequest,
  UpdateMatRequest,
  FindMatRequest,
  GetMatByIdRequest,
} = require("../../db/mat_board_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const matSchema = require("../schema/mat");

const { matRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkAdmin, validate(matSchema), wrap(async (req) => {
  const body = req.body;

  return await matRepo.create(
    req.ctx,
    new CreateMatRequest(body.displayName, body.image, body.isDeleted)
  );
}));

router.get("/", wrap(async (req) => {
  const { ids, includeDeleted } = req.query;
  return await matRepo.find(req.ctx, new FindMatRequest(ids, includeDeleted));
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await matRepo.get(req.ctx, new GetMatByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(matSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;

  return await matRepo.update(
    req.ctx,
    new UpdateMatRequest(
      params.id,
      body.displayName,
      body.image,
      body.isDeleted,
    )
  );

}));


module.exports = router;
