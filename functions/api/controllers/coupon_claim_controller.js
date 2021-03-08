const {
  CreateCouponClaimRequest,
  CheckCouponClaimByIdRequest,
} = require("../../db/coupon_claims_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const couponClaimSchema = require("../schema/couponClaim");

const { couponClaimsRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkLoggedIn, validate(couponClaimSchema), wrap(async (req) => {
  const body = req.body;
  return await couponClaimsRepo.create(req.ctx || {}, new CreateCouponClaimRequest(
    body.couponId

  ));
}));

router.get("/:id", checkLoggedIn, validate(couponClaimSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;
  return await couponRepo.checkClaim(req.ctx, new CheckCouponClaimByIdRequest(body.couponId));
}));

module.exports = router;
