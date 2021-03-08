const {
  CreateShippingRequest,
  UpdateShippingRequest,
  FindShippingRequest,
  GetShippingByIdRequest,
  GetShippingByZipRequest,
} = require("../../db/shipping_repo");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const ShippingSchema = require("../schema/shipping");

const { shippingRepo } = require("../../db/repo_instances");

const { checkAdmin } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(ShippingSchema),
  wrap(async (req) => {
    const body = req.body;
    return await shippingRepo.create(
      req.ctx,
      new CreateShippingRequest(body.fee, body.zip)
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const { ids, includeDeleted } = req.query;
    return await shippingRepo.find(
      req.ctx,
      new FindShippingRequest(ids, includeDeleted)
    );
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await shippingRepo.get(
      req.ctx,
      new GetShippingByIdRequest(params.id)
    );
  })
);

router.get(
  "/:zip/zip",
  wrap(async (req) => {
    const params = req.params;
    return await shippingRepo.getByZipCode(
      req.ctx,
      new GetShippingByZipRequest(params.zip)
    );
  })
);


router.post(
  "/:id",
  checkAdmin,
  validate(ShippingSchema),
  wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    const updateReq = new UpdateShippingRequest(params.id, body.fee, body.zip);

    return await shippingRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
