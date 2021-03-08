const { DateTime } = require("luxon");
const shortid = require("shortid");
const {
    NotFoundException, BadRequestException
} = require("../requests/exceptions");

const Requests = require("../requests/requests");

class Coupon {
    constructor(
        id,
        displayName,
        description,
        discount,
        expiryDate,
        createdBy,
        createdOn,
        isDeleted,
        lastUpdatedBy,
        lastUpdatedOn
    ) {
        this.id = id;
        this.displayName = displayName;
        this.description = description;
        this.discount = discount;
        this.expiryDate = expiryDate;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.isDeleted = isDeleted;
        this.lastUpdatedBy = lastUpdatedBy;
        this.lastUpdatedOn = lastUpdatedOn
    }
}

class CreateCouponRequest {
    constructor(
        displayName,
        description,
        discount,
        expiryDate,
        isDeleted
    ) {
        this.displayName = displayName,
        this.description = description,
        this.discount = discount,
        this.expiryDate = expiryDate,
        this.isDeleted = isDeleted
    }
}

class CreateCouponResponse {
    constructor(coupon) {
        this.coupon = coupon;
    }
}

class UpdateCouponRequest {
    constructor(
        id,
        displayName,
        description,
        discount,
        expiryDate,
        isDeleted,
    ) {
        this.id = id,
        this.displayName = displayName,
        this.description = description,
        this.discount = discount,
        this.expiryDate = expiryDate,
        this.isDeleted = isDeleted
    }
}

class UpdateCouponResponse {
    constructor(coupon) {
        this.coupon = coupon;
    }
}

class GetCouponByIdRequest {
    constructor(id) {
        this.id = Requests.checkInstance(id, "id", "string");
    }
}

class GetCouponByIdResponse {
    constructor(coupon) {
        this.coupon = coupon;
    }
}

class FindCouponRequest {
    constructor() {
    }
}

class FindCouponResponse {
    constructor(coupons) {
        this.coupons = coupons;
    }
}

class CouponRepo {
    constructor(db) {
        this.db = db;
        this.collection = db.collection("coupons");
    }

    async create(ctx,  req) {

        return await this.db.runTransaction(async (t) => {

            const id = shortid.generate();
            const docRef = this.collection.doc(id);
            const now = DateTime.utc().toMillis();

            const data = {
                displayName: req.displayName,
                description: req.description,
                discount: req.discount,
                expiryDate: req.expiryDate,
                createdBy: ctx.user.id || "",
                createdOn: now,
                lastUpdatedOn: now,
                isDeleted: false,
                lastUpdatedBy: ctx.user.id || "",

            };

            t.create(docRef, data);

            return new CreateCouponResponse(
                new Coupon(
                    id,
                    data.displayName,
                    data.description,
                    data.discount,
                    data.expiryDate,
                    data.createdBy,
                    data.createdOn,
                    data.isDeleted,
                    data.lastUpdatedBy,
                    data.lastUpdatedOn
                ),
            );
        });
    }



    async get(req) {
        const docRef = this.collection.doc(req.id);
        const doc = await docRef.get();
        const data = doc.data();
        if (!data) {
            throw new NotFoundException(`Document with id not found: ${req.id}`);
        }

        return new GetCouponByIdResponse(
            new Coupon(
                doc.id,
                data.displayName,
                data.description,
                data.discount,
                data.expiryDate,
                data.createdBy,
                data.createdOn,
                data.isDeleted,
                data.lastUpdatedBy,
                data.lastUpdatedOn
            ),
        );
    }

    async find(req) {
        const snapshot = await this.collection.get();
        const result = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            result.push(new Coupon(
                doc.id,
                data.displayName,
                data.description,
                data.discount,
                data.expiryDate,
                data.createdBy,
                data.createdOn,
                data.isDeleted,
                data.lastUpdatedBy,
                data.lastUpdatedOn,
            ));
        });

        return new FindCouponResponse(result);
    }

    async update( ctx, req) {


        const docRef = this.collection.doc(req.id);
        return await this.db.runTransaction(async (t) => {
            const doc = await t.get(docRef);
            const data = doc.data();
            if (!data) {
                throw new NotFoundException(`Document with id not found: ${req.id}`);
            }
            let flag = 0;
            if (req.displayName !== undefined) {
                data.displayName = req.displayName;
                flag = 1;
            }
            if (req.description !== undefined) {
                data.description = req.description;
                flag = 1;
            }
            if (req.isDeleted !== undefined) {
                data.isDeleted = req.isDeleted;
                flag = 1;
            }
            if (req.discount !== undefined) {
                data.discount = req.discount;
                flag = 1;
            }
            if (req.expiryDate !== undefined) {
                data.expiryDate = req.expiryDate;
                flag = 1;
            }
            if (flag === 1) {
                data.lastUpdatedOn = DateTime.utc().toMillis();
                data.lastUpdatedBy = ctx.user.id || "";
            }
            t.update(docRef, data);
            return new UpdateCouponResponse(
                new Coupon(
                    doc.id,
                    data.displayName,
                    data.description,
                    data.discount,
                    data.expiryDate,
                    data.createdBy,
                    data.createdOn,
                    data.isDeleted,
                    data.lastUpdatedBy,
                    data.lastUpdatedOn,
                ),
            );
        });

    }
}

module.exports = {
    CreateCouponRequest,
    CreateCouponResponse,
    UpdateCouponRequest,
    UpdateCouponResponse,
    GetCouponByIdRequest,
    GetCouponByIdResponse,
    FindCouponRequest,
    FindCouponResponse,
    CouponRepo,
};
