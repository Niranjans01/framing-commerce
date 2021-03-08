const {
  CreateBackingRequest,
  UpdateBackingRequest,
  FindBackingRequest,
  GetBackingByIdRequest,
} = require("../../db/backing_repo");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const backingSchema = require("../schema/backing");

const { backingRepo } = require("../../db/repo_instances");

const { checkAdmin } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(backingSchema),
  wrap(async (req) => {
    const body = req.body;
    return await backingRepo.create(
      req.ctx,
      new CreateBackingRequest(
        body.displayName,
        body.description,
        body.isNew,
        body.priceCode,
        body.discount
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const { ids, includeDeleted } = req.query;
    return await backingRepo.find(req.ctx, new FindBackingRequest(ids, includeDeleted));
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await backingRepo.get(req.ctx, new GetBackingByIdRequest(params.id));
  })
);

router.post(
  "/:id", checkAdmin,
  validate(backingSchema),
  wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    const updateReq = new UpdateBackingRequest(
      params.id,
      body.displayName,
      body.description,
      body.isNew,
      body.priceCode,
      body.discount,
      body.isDeleted,
      body.isDefault
    );

    return await backingRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
