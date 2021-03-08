const shortid = require("shortid");
const { selectPresent } = require("./repo_utils");
const {
  NotFoundException, ForbiddenAccessException
} = require("../requests/exceptions");

const { getAddressObject } = require("./repo_utils");
const { DateTime } = require("luxon");
const admin = require("../firebase/admin");
const { GetUserByIdRequest } = require("./user_repo");
const { GetBackingByIdRequest } = require("./backing_repo");
const { GetDimensionByIdRequest } = require("./dimension_repo");
const { GetEdgeByIdRequest } = require("./edge_repo");
const { GetEdgeWidthByIdRequest } = require("./edge_width_repo");
const { GetFrameByIdRequest } = require("./frame_repo");
const { GetGlassByIdRequest } = require("./glass_repo");
const { GetMatByIdRequest } = require("./mat_board_repo");
const { GetMirrorByIdRequest } = require("./mirror_repo");
const { GetPrintByIdRequest } = require("./print_repo");
const { GetStretchingByIdRequest } = require("./stretching_repo");
const { FindImageRequest } = require("./image_repo");
const { GetProductByIdRequest } = require("./product_repo");
const { GetCouponByIdRequest } = require("./coupon_repo");
const { GetPriceCodeByIdRequest, FindPriceCodeRequest } = require("./price_code_repo");
const { GetGiftByIdRequest, UpdateGiftRequest, CreateGiftRequest } = require("./gift_repo");
const { CheckCouponClaimByIdRequest, CreateCouponClaimRequest } = require("./coupon_claims_repo");
const { doc } = require("../firebase/firestore");
const order = require("../api/schema/order");
const functions = require("firebase-functions");

class Order {
  constructor(
    id,
    items,
    isPaid,
    isShipped,
    trackingNumber,
    paymentProvider,
    transactionId,
    shippingAddress,
    billingAddress,
    deliveryCharges,
    couponCode,
    giftCode,
    orderTotal,
    owner,
    orderDate,
    lastUpdatedBy,
    lastUpdatedOn,
  ) {
    this.id = id;
    this.items = items;
    this.isPaid = isPaid;
    this.isShipped = isShipped;
    this.trackingNumber = trackingNumber;
    this.paymentProvider = paymentProvider;
    this.transactionId = transactionId;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.deliveryCharges = deliveryCharges;
    this.couponCode = couponCode;
    this.giftCode = giftCode;
    this.orderTotal = orderTotal;
    this.owner = owner;
    this.orderDate = orderDate;
    this.lastUpdatedBy = lastUpdatedBy;
    this.lastUpdatedOn = lastUpdatedOn;
  }
}

class CreateOrderRequest {
  constructor(
    items,
    shippingAddress,
    billingAddress,
    deliveryCharges,
    paymentProvider,
    couponCode,
    giftCode
  ) {
    this.items = items;
    this.shippingAddress = getAddressObject([shippingAddress])[0];
    this.billingAddress = getAddressObject([billingAddress])[0];
    this.deliveryCharges = deliveryCharges;
    this.paymentProvider = paymentProvider;
    this.couponCode = couponCode;
    this.giftCode = giftCode;
  }
}

class CreateOrderResponse {
  constructor(order) {
    this.order = order;
  }
}

class UpdateOrderRequest {
  constructor(
    id,
    isPaid,
    transactionId,
    isShipped,
    trackingNumber,
  ) {
    this.id = id;
    this.isPaid = isPaid;
    this.transactionId = transactionId;
    this.isShipped = isShipped;
    this.trackingNumber = trackingNumber;
  }
}

class UpdateOrderResponse {
  constructor(order) {
    this.order = order;
  }
}

class GetOrderByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetOrderByIdResponse {
  constructor(order) {
    this.order = order;
  }
}

class GetOrderByTransactionIdRequest {
  constructor(transactionId) {
    this.transactionId = transactionId;
  }
}

class GetOrderByTransactionIdResponse {
  constructor(order) {
    this.order = order;
  }
}

class FindOrderRequest {
  constructor(shipped, paid, start, limit) {
    this.shipped = shipped;
    this.paid = paid;
    this.start = start;
    this.limit = limit;
  }
}

class FindOrderResponse {
  constructor(orders) {
    this.orders = orders;
  }
}

class OrderRepo {
  constructor(db, userRepo, backingRepo, dimensionRepo, edgeRepo, edgeWidthRepo,
    frameRepo, glassRepo, matRepo, mirrorRepo, printRepo, stretchingRepo, imageRepo, priceCodeRepo, productRepo, couponRepo, giftRepo, couponClaimsRepo) {
    this.db = db;
    this.collection = db.collection("order");
    this.userRepo = userRepo;
    this.backingRepo = backingRepo;
    this.dimensionRepo = dimensionRepo;
    this.edgeRepo = edgeRepo;
    this.edgeWidthRepo = edgeWidthRepo;
    this.frameRepo = frameRepo;
    this.glassRepo = glassRepo;
    this.matRepo = matRepo;
    this.mirrorRepo = mirrorRepo;
    this.printRepo = printRepo;
    this.stretchingRepo = stretchingRepo;
    this.imageRepo = imageRepo;
    this.priceCodeRepo = priceCodeRepo;
    this.productRepo = productRepo;
    this.couponRepo = couponRepo;
    this.giftRepo = giftRepo;
    this.couponClaimsRepo = couponClaimsRepo;
  }

  discount(price, discount) {
    return price - (price * discount / 100)
  }

  roundoff(number, min = 30) {
    if (number < min) {
      return min;
    }
    else if (number > 300) {
      return 300;
    }
    else {
      return (Math.floor(number / 5) * 5);
    }
  }

  computePriceFromPriceCode(dimension, priceCode, discount) {
    let price = 0;
    if (priceCode) {
      if (priceCode.multiplier) {
        functions.logger.info("multiplier", priceCode.multiplier);
        price = dimension * priceCode.multiplier;
      } else {
        const priceKeys = Object.keys(priceCode.prices);
        const min = priceKeys.length ? priceKeys[0] : 30;
        const roundOffDim = this.roundoff(dimension, min);
        functions.logger.info("lookup dimension", roundOffDim);
        price = priceCode.prices[roundOffDim];
      }

      if (discount) {
        price = this.discount(price, discount);
      }
    }

    functions.logger.info("partial price: ", price);
    return price;
  }

  async getPriceOfConfiguration(ctx, configuration, dimension) {
    let price = 0;
    functions.logger.info("dimension: ", dimension);
    const config = configuration.type;
    if (config === "frame") {
      let doc = await this.frameRepo.get(ctx, new GetFrameByIdRequest(configuration.value));
      if (doc.frame.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.frame.priceCode));
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, null);
      }
    }
    else if (config === "top_mat") {
      const price_doc = await this.priceCodeRepo.find(new FindPriceCodeRequest(undefined, 'Top Mat'));
      price += this.computePriceFromPriceCode(dimension, price_doc.priceCodes[0], null);
    }
    else if (config === "bottom_mat") {
      const price_doc = await this.priceCodeRepo.find(new FindPriceCodeRequest(undefined, 'Bottom Mat'));
      price += this.computePriceFromPriceCode(dimension, price_doc.priceCodes[0], null);
    }
    else if (config === "backing") {
      const doc = await this.backingRepo.get(ctx, new GetBackingByIdRequest(configuration.value));
      if (doc.backing.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.backing.priceCode));
        const discount = doc.backing.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    }
    else if (config === "glass") {
      const doc = await this.glassRepo.get(ctx, new GetGlassByIdRequest(configuration.value));
      if (doc.glass.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.glass.priceCode));
        const discount = doc.glass.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    }
    else if (config === "edge") {
      const doc = await this.edgeRepo.get(ctx, new GetEdgeByIdRequest(configuration.value));
      if (doc.edge.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.edge.priceCode));
        const discount = doc.edge.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    }
    else if (config === "edge_width") {
      const doc = await this.edgeWidthRepo.get(ctx, new GetEdgeWidthByIdRequest(configuration.value));
      if (doc.edgeWidth.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.edgeWidth.priceCode));
        const discount = doc.edgeWidth.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    }
    else if (config === "mirror") {
      const doc = await this.mirrorRepo.get(ctx, new GetMirrorByIdRequest(configuration.value));
      if (doc.mirror.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.mirror.priceCode));
        const discount = doc.mirror.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    }
    else if (config === "print") {
      const doc = await this.printRepo.get(ctx, new GetPrintByIdRequest(configuration.value));
      if (doc.print.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.print.priceCode));
        const discount = doc.print.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    }
    else if (config === "stretching") {
      const doc = await this.stretchingRepo.get(ctx, new GetStretchingByIdRequest(configuration.value));
      if (doc.stretching.priceCode) {
        const price_doc = await this.priceCodeRepo.get(new GetPriceCodeByIdRequest(doc.stretching.priceCode));
        const discount = doc.stretching.discount;
        price += this.computePriceFromPriceCode(dimension, price_doc.priceCode, discount);
      }
    } else if (config === "dimension") {
      // do nothing
    } else {
      throw new Error("Unsupported config: " + config);
    }
    return price;
  }

  async computePrice(ctx, item, displayName) {
    let dimension = 0;
    let price = [];
    let product;
    if (item.product === "gift-voucher") {
      const gift = item.configurations[0].value;
      await this.giftRepo.create(
        new CreateGiftRequest(
          gift.recipientName,
          gift.recipientEmail,
          gift.senderName,
          gift.message,
          item.price
        )
      );
      return item.price;
    } else {
      product = await this.productRepo.get(
        ctx,
        new GetProductByIdRequest(item.product)
      );
      const product_discount = product.product.discount || 0;
      if (item.configurations) {
        for (let configuration of item.configurations) {
          const type = configuration.type;
          if (type === "dimension") {
            dimension += configuration.value.height + configuration.value.width;
          } else if (type === "frame") {
            // eslint-disable-next-line no-await-in-loop
            const { frame } = await this.frameRepo.get(
              ctx,
              new GetFrameByIdRequest(configuration.value)
            );
            if (frame) {
              dimension += frame.width * 4;
            }
          } else if (type === "bottom_mat" || type === "top_mat") {
            const value = configuration.value;
            if (value) {
              dimension += value.left + value.right + value.top + value.bottom;
            }
          }
        }
        for (let configuration of item.configurations) {
          price.push(
            this.getPriceOfConfiguration(ctx, configuration, dimension)
          );
        }
        if (displayName === "Clip Frames") {
          const price_doc = await this.priceCodeRepo.find(
            new FindPriceCodeRequest("", "Perspex Clip Frames")
          );
          price.push(
            this.computePriceFromPriceCode(
              dimension,
              price_doc.priceCodes[0],
              0
            )
          );
        }
        if (displayName === "Corkboards") {
          const price_doc = await this.priceCodeRepo.find(
            new FindPriceCodeRequest("", "Cork Boards")
          );
          price.push(
            this.computePriceFromPriceCode(
              dimension,
              price_doc.priceCodes[0],
              0
            )
          );
        }
        price = await Promise.all(price);
        const sum = price.reduce((a, b) => {
          return a + b;
        }, 0);
        return this.discount(sum, product_discount);
      } else if (item.variant) {
        return this.discount(item.variant.price, product_discount);
      } else {
        return 0;
      }
    }
  }

  async giftVoucherDiscount(ctx, giftCode, uid) {
    if (giftCode === null || giftCode === undefined) {
      return 0;
    }
    else {
      const gift = await this.giftRepo.get(ctx, new GetGiftByIdRequest(giftCode));

      if (await this._verifyUserEmail(uid, gift.gift.recipientEmail)) {

        await this.giftRepo.update(new UpdateGiftRequest(
          giftCode,
          gift.gift.recipientName,
          gift.gift.recipientEmail,
          undefined,
          undefined,
          undefined,
          undefined,
          true
        ))
        return gift.gift.amount
      }
      return 0;
    }
  }

  async _mintImage(ctx, image) {
    if (!image) {
      return null;
    }
    const { images } = await this.imageRepo.find(new FindImageRequest([image]))
    return images[0];
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {

      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const items = await Promise.all(req.items.map(async item => {
        return {
          product: item.product,
          quantity: item.quantity,
          configurations: item.configurations || null,
          variant: item.variant || null,
          price: Math.round(await this.computePrice(ctx || {}, item, item.displayName)),
          image: item.image || null,
        };
      }));
      let orderTotal = 0;
      for (let item of items) {
        orderTotal = orderTotal + (item.price * item.quantity)
      }
      if (req.couponCode) {
        const coupon_doc = await this.couponRepo.get(new GetCouponByIdRequest(req.couponCode.id))
        const coupon_discount = coupon_doc.coupon.discount;
        if ((coupon_doc.coupon.expiryDate - DateTime.utc().toMillis()) >= 0) {
        //   if (await this.couponClaimsRepo.get(ctx, new CheckCouponClaimByIdRequest(req.couponCode.id,))) {
            orderTotal = orderTotal - (orderTotal * coupon_discount / 100)
        //     await this.couponClaimsRepo.create(ctx, new CreateCouponClaimRequest(
        //       req.couponCode,

        //     ))
        //   }
        }
      }
      let deliveryCharges = req.deliveryCharges || 0
      orderTotal = orderTotal + deliveryCharges;
      const gift_discount = await this.giftVoucherDiscount(ctx, req.giftCode, ctx && ctx.user && ctx.user.id)
      if (gift_discount <= orderTotal) {
        orderTotal = orderTotal - gift_discount
      }
      else if (gift_discount > orderTotal) {
        orderTotal = 0
      }
      const data = {
        items,
        isPaid: false,
        isShipped: false,
        paymentProvider: req.paymentProvider,
        shippingAddress: req.shippingAddress,
        billingAddress: req.billingAddress,
        deliveryCharges: req.deliveryCharges,
        couponCode: req.couponCode,
        giftCode: req.giftCode,
        orderTotal: orderTotal,
        owner: ctx && ctx.user && ctx.user.id,
        orderDate: DateTime.utc().toMillis(),
      };

      t.create(docRef, data);
      const itemsWithImageMinted = await Promise.all(items.map(async item => {
        return {
          product: item.product,
          quantity: item.quantity,
          configurations: item.configurations || null,
          variant: item.variant || null,
          price: item.price,
          image: await this._mintImage(ctx, item.image)
        };
      }));
      return new CreateOrderResponse(
        new Order(
          id,
          itemsWithImageMinted,
          data.isPaid,
          data.isShipped,
          null,
          data.paymentProvider,
          null,
          data.shippingAddress,
          data.billingAddress,
          data.deliveryCharges,
          data.couponCode,
          data.giftCode,
          data.orderTotal,
          await this._fetchUser(ctx, data.owner),
          data.orderDate,
          null,
          null
        ),
      );
    });
  }

  async getByTransactionId(ctx, req) {
    const query = await this.collection.where("transactionId", "==", req.transactionId)
    const snapshot = await query.get();
    const promises = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      promises.push(
        async () => {
          return new Order(
            doc.id,
            data.items,
            data.isPaid,
            data.isShipped,
            data.trackingNumber,
            data.paymentProvider,
            data.transactionId,
            data.shippingAddress,
            data.billingAddress,
            data.deliveryCharges,
            data.couponCode,
            data.orderTotal,
            await this._fetchUser(ctx, data.owner),
            data.orderDate,
            data.lastUpdatedBy ? await this._fetchUser(ctx, data.lastUpdatedBy) : null,
            data.lastUpdatedOn,
          )
        }
      );
    });

    const result = await Promise.all(promises.map(fn => fn()));
    return new GetOrderByTransactionIdResponse(result[0]);
  }

  async get(ctx, req) {

    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }
    if (data.owner === ctx.user.id || ctx.user.isAdmin) {
      const itemsWithImageMinted = await Promise.all(data.items.map(async item => {
        return {
          product: item.product,
          quantity: item.quantity,
          configurations: item.configurations || null,
          variant: item.variant || null,
          price: item.price,
          image: await this._mintImage(ctx, item.image)
        };
      }));
      return new GetOrderByIdResponse(
        new Order(
          doc.id,
          itemsWithImageMinted,
          data.isPaid,
          data.isShipped,
          data.trackingNumber,
          data.paymentProvider,
          data.transactionId,
          data.shippingAddress,
          data.billingAddress,
          data.deliveryCharges,
          data.couponCode,
          data.giftCode,
          data.orderTotal,
          await this._fetchUser(ctx, data.owner),
          data.orderDate,
          data.lastUpdatedBy ? await this._fetchUser(ctx, data.lastUpdatedBy) : null,
          data.lastUpdatedOn,
        ),
      );
    }
    else {
      throw new ForbiddenAccessException('Unauthorized access of the order');
    }
  }

  async find(ctx, req) {
    let query = await this.collection
      .orderBy("orderDate", "desc");

    if (!ctx.user.isAdmin) {
      query = query.where("owner", "==", ctx.user.id);
    }

    if (req.shipped) {
      query = query.where("isShipped", "==", req.shipped === true || req.shipped === 'true');
    }

    if (req.paid) {
      query = query.where("isPaid", "==", req.paid === true || req.paid === 'true');
    }

    if (req.start) {
      query = query.offset(parseInt(req.start));
    } else {
      query = query.offset(0);
    }

    if (req.limit) {
      query = query.limit(parseInt(req.limit));
    } else {
      query = query.limit(100);
    }

    const snapshot = await query.get();
    const promises = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      promises.push(
        async () => {
          return new Order(
            doc.id,
            data.items,
            data.isPaid,
            data.isShipped,
            data.trackingNumber,
            data.paymentProvider,
            data.transactionId,
            data.shippingAddress,
            data.billingAddress,
            data.deliveryCharges,
            data.couponCode,
            data.giftCode,
            data.orderTotal,
            await this._fetchUser(ctx, data.owner),
            data.orderDate,
            data.lastUpdatedBy ? await this._fetchUser(ctx, data.lastUpdatedBy) : null,
            data.lastUpdatedOn,
          )
        }
      );
    });

    const result = await Promise.all(promises.map(fn => fn()));
    return new FindOrderResponse(result);
  }

  async count(ctx, req) {
    let query = await this.collection;

    if (!ctx.user.isAdmin) {
      query = query.where("owner", "==", ctx.user.id);
    }

    if (req.shipped) {
      query = query.where("isShipped", "==", req.shipped === true || req.shipped === 'true');
    }

    if (req.paid) {
      query = query.where("isPaid", "==", req.paid === true || req.paid === 'true');
    }

    const snapshot = await query.get();
    return {
      count: snapshot.size
    };
  }


  async update(ctx, req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }

      data.isPaid = selectPresent(req.isPaid, data.isPaid);
      data.transactionId = selectPresent(req.transactionId, data.transactionId);
      data.trackingNumber = selectPresent(req.trackingNumber, data.trackingNumber);
      data.isShipped = selectPresent(req.isShipped, data.isShipped);
      // last update fields are for admin only
      if (ctx && ctx.user && ctx.user.isAdmin) {
        data.lastUpdatedBy = ctx.user ? ctx.user.id : null;
        data.lastUpdatedOn = DateTime.utc().toMillis();
      }
      t.update(docRef, data);
      const itemsWithImageMinted = await Promise.all(data.items.map(async item => {
        return {
          product: item.product,
          quantity: item.quantity,
          configurations: item.configurations || null,
          variant: item.variant || null,
          price: item.price,
          image: await this._mintImage(ctx, item.image)
        };
      }));
      return new UpdateOrderResponse(
        new Order(
          doc.id,
          itemsWithImageMinted,
          data.isPaid,
          data.isShipped,
          data.trackingNumber,
          data.paymentProvider,
          data.transactionId,
          data.shippingAddress,
          data.billingAddress,
          data.deliveryCharges,
          data.couponCode,
          data.giftCode,
          data.orderTotal,
          await this._fetchUser(ctx, data.owner),
          data.orderDate,
          data.lastUpdatedBy ? await this._fetchUser(ctx, data.lastUpdatedBy) : null,
          data.lastUpdatedOn,
        ),
      );
    });

  }
  async _fetchUser(ctx, uid) {
    if (!uid) {
      return {
        firstName: "Guest"
      };
    }
    return (await this.userRepo.get(
      // ctx,
      new GetUserByIdRequest(uid),
    )).user;
  }

  async _verifyUserEmail(uid, recipientEmail) {
    let email = ''
    if (!uid) {
      return 0;
    }
    else {
      await admin.auth().getUser(uid).then(userRecord => {
        email = userRecord.email
        return email
      })
    }
    if (email === recipientEmail) {
      return 1
    }

    return 0

  }
}

module.exports = {
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  GetOrderByIdRequest,
  GetOrderByIdResponse,
  GetOrderByTransactionIdRequest,
  GetOrderByTransactionIdResponse,
  FindOrderRequest,
  FindOrderResponse,
  OrderRepo,
};
