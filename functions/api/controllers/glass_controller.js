const {
  CreateGlassRequest,
  UpdateGlassRequest,
  FindGlassRequest,
  GetGlassByIdRequest,
} = require("../../db/glass_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const glassSchema = require("../schema/glass");

const { glassRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(glassSchema),
  wrap(async (req) => {
    const body = req.body;
    return await glassRepo.create(
      req.ctx,
      new CreateGlassRequest(
        body.displayName,
        body.description,
        body.priceCode,
        body.discount,
        body.isNew,
        body.isDeleted,
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const { ids, includeDeleted } = req.query;
    return await glassRepo.find(req.ctx, new FindGlassRequest(ids, includeDeleted));
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await glassRepo.get(req.ctx, new GetGlassByIdRequest(params.id));
  })
);

router.post(
  "/:id", checkAdmin,
  validate(glassSchema),
  wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    const updateReq = new UpdateGlassRequest(
      params.id,
      body.displayName,
      body.description,
      body.priceCode,
      body.discount,
      body.isNew,
      body.isDeleted,
      body.isDefault
    );

    return await glassRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
