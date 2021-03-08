const {
  CreateEdgeRequest,
  UpdateEdgeRequest,
  FindEdgeRequest,
  GetEdgeByIdRequest,
} = require("../../db/edge_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const { edgeRepo } = require("../../db/repo_instances");
const edgeSchema = require("../schema/edge");
const { checkAdmin } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(edgeSchema),
  wrap(async (req) => {
    const body = req.body;
    return await edgeRepo.create(
      req.ctx,
      new CreateEdgeRequest(
        body.displayName,
        body.description,
        body.isNew,
        body.discount,
        body.images,
        body.priceCode,
        body.isDeleted,
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const { ids, includeDeleted } = req.query;
    return await edgeRepo.find(req.ctx, new FindEdgeRequest(ids, includeDeleted));
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await edgeRepo.get(req.ctx, new GetEdgeByIdRequest(params.id));
  })
);

router.post(
  "/:id", checkAdmin,
  wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    const updateReq = new UpdateEdgeRequest(
      params.id,
      body.displayName,
      body.description,
      body.isNew,
      body.discount,
      body.images,
      body.priceCode,
      body.isDeleted,
    );

    return await edgeRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
