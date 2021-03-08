const {
  CreateDimensionRequest,
  UpdateDimensionRequest,
  FindDimensionRequest,
  GetDimensionByIdRequest,
} = require("../../db/dimension_repo");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const dimensionSchema = require("../schema/dimension");

const { dimensionRepo } = require("../../db/repo_instances");
const { checkAdmin } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(dimensionSchema),
  wrap(async (req) => {
    const body = req.body;
    return await dimensionRepo.create(
      req.ctx,
      new CreateDimensionRequest(
        body.displayName,
        body.height,
        body.width,
        body.minimumHeight,
        body.minimumWidth,
        body.maximumHeight,
        body.maximumWidth,
        body.isCustom,
        body.isDeleted
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const { ids, includeDeleted } = req.query;
    return await dimensionRepo.find(req.ctx, new FindDimensionRequest(ids, includeDeleted));
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await dimensionRepo.get(req.ctx, new GetDimensionByIdRequest(params.id));
  })
);

router.post(
  "/:id", checkAdmin,
  validate(dimensionSchema),
  wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    const updateReq = new UpdateDimensionRequest(
      params.id,
      body.displayName,
      body.height,
      body.width,
      body.minimumHeight,
      body.minimumWidth,
      body.maximumHeight,
      body.maximumWidth,
      body.isCustom,
      body.isDeleted,
      body.isDefault
    );

    return await dimensionRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
