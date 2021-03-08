const {
  EdgeWidthRepo,
  CreateEdgeWidthRequest,
  UpdateEdgeWidthRequest,
  FindEdgeWidthRequest,
  GetEdgeWidthByIdRequest,
} = require("../../db/edge_width_repo");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const edgeWidthSchema = require("../schema/edgeWidth");

const { edgeWidthRepo } = require("../../db/repo_instances");
const { checkAdmin } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(edgeWidthSchema),
  wrap(async (req) => {
    const body = req.body;
    return await edgeWidthRepo.create(
      req.ctx,
      new CreateEdgeWidthRequest(
        body.displayName,
        body.description,
        body.isNew,
        body.priceCode,
        body.discount,
        body.isDeleted,
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const { ids, includeDeleted } = req.query;
    return await edgeWidthRepo.find(req.ctx, new FindEdgeWidthRequest(ids, includeDeleted));
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await edgeWidthRepo.get(req.ctx, new GetEdgeWidthByIdRequest(params.id));
  })
);

router.post(
  "/:id",
  checkAdmin,
  validate(edgeWidthSchema),
  wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    const updateReq = new UpdateEdgeWidthRequest(
      params.id,
      body.displayName,
      body.description,
      body.isNew,
      body.priceCode,
      body.discount,
      body.isDeleted,
    );

    return await edgeWidthRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
