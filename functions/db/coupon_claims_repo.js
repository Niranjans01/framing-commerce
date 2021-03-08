const shortid = require("shortid");
const {
  NotFoundException, BadRequestException
} = require("../requests/exceptions");

const { DateTime } = require("luxon");
const Requests = require("../requests/requests");

class CouponClaim {
  constructor(
    id,
    couponId,
    claimedBy,
    claimedOn
  ) {
    this.id = id;
    this.couponId = couponId;
    this.claimedBy = claimedBy;
    this.claimedOn = claimedOn;
  }
}

class CreateCouponClaimRequest {
  constructor(
    couponId
  ) {
    this.couponId = Requests.checkInstance(couponId, "displayName", "string");
  }
}

class CreateCouponClaimResponse {
  constructor(coupon) {
    this.coupon = coupon;
  }
}


class CheckCouponClaimByIdRequest {
  constructor(couponId) {
    this.id = Requests.checkInstance(id, "id", "string");
    this.id = Requests.checkInstance(couponId, "couponId", "string");
  }
}

class CheckCouponClaimByIdResponse {
  constructor(coupon) {
    this.coupon = coupon;
  }
}

class CouponClaimRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("coupon_claims");
  }

  async create(ctx, req) {

    return await this.db.runTransaction(async (t) => {

      const id = shortid.generate();
      const docRef = this.collection.doc(id);

      const data = {
        couponId: req.couponId,
        claimedBy: ctx.user.id || "",
        claimedOn: DateTime.utc().toMillis(),


      };

      t.create(docRef, data);

      return new CreateCouponClaimResponse(
        new CouponClaim(
          id,
          data.couponId,
          data.claimedBy,
          data.claimedOn,
        ),
      );
    });
  }

  async checkClaim(ctx, req) {
    const docRef = this.collection.where("claimedBy", "==", ctx.user.id).where("couponId", "==", req.couponId);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data) {
      return true
    }
    return false
  }
}

module.exports = {
  CreateCouponClaimRequest,
  CreateCouponClaimResponse,
  CheckCouponClaimByIdRequest,
  CheckCouponClaimByIdResponse,
  CouponClaimRepo,
};
