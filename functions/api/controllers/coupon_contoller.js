const {
  CreateCouponRequest,
  UpdateCouponRequest,
  FindCouponRequest,
  GetCouponByIdRequest,
} = require("../../db/coupon_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const couponSchema = require("../schema/coupon");

const { couponRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkAdmin, validate(couponSchema), wrap(async (req) => {
  const body = req.body;
  return await couponRepo.create(req.ctx || {}, new CreateCouponRequest(
    body.displayName,
    body.description,
    body.discount,
    body.expiryDate
  ));
}));

router.get("/", wrap(async (req) => {
  return await couponRepo.find(new FindCouponRequest());
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await couponRepo.get(new GetCouponByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(couponSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;

  return await couponRepo.update(req.ctx || {}, new UpdateCouponRequest(
    params.id,
    body.displayName,
    body.description,
    body.discount,
    body.expiryDate,
    body.isDeleted,
  ));
}));


module.exports = router;
