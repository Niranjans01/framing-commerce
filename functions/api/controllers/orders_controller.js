const {
  CreateOrderRequest,
  UpdateOrderRequest,
  FindOrderRequest,
  GetOrderByIdRequest,
} = require("../../db/order_repo");

const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const { BadRequestException } = require("../../requests/exceptions");
const orderSchema = require("../schema/order");

const { orderRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");
const { ewayService, afterpayService } = require("../../payment/payment_instances");

function toAfterPayAddress(address) {
  return {
    name: address.firstname + " " + address.lastname,
    line1: `${address.street}, ${address.suburb}`,
    line2: address.city,
    countryCode: "AU",
    region: address.state,
    postcode: address.zip
  }
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

router.post("/new", validate(orderSchema), wrap(async (req) => {
  const body = req.body;
  const { order } = await orderRepo.create(req.ctx, new CreateOrderRequest(
    body.items,
    body.shippingAddress,
    body.billingAddress,
    body.deliveryCharges,
    body.paymentProvider,
    body.couponCode,
    body.giftCode
  ));
  let totalPrice = Math.round(round(order.orderTotal,2));
  // order.items.forEach(item => totalPrice += item.price*item.quantity || 0);
  // totalPrice = totalPrice + order.deliveryCharges;
  const cancelUrl = functions.config().host.web + "/other/order-cancelled";
  if (totalPrice === 0) {
    await orderRepo.update(req.ctx, new UpdateOrderRequest(
      order.id,
      true,
      orderToken,
      undefined,
      undefined
    ));
    const orderConfirmUrl = functions.config().host.web + "/other/order-confirm"
    return { orderConfirmUrl };
  }
  else {
    if (order.paymentProvider === "eway") {
      const { paymentUrl } = await ewayService.createPayment(req.ctx, {
        orderId: order.id,
        totalPrice: totalPrice * 100,
        redirectUrl: functions.config().host.api + "/eway/validate",
        cancelUrl
      });
      await orderRepo.update(req.ctx, new UpdateOrderRequest(
        order.id,
        true,
        undefined,
        undefined,
        undefined
      ));
      return {
        paymentUrl
      };
    } else if (order.paymentProvider === "afterpay") {
      const afterPayReq = {
        orderId: order.id,
        redirectUrl: functions.config().host.api + "/afterpay/validate",
        cancelUrl,
        billing: toAfterPayAddress(order.billingAddress),
        shipping: toAfterPayAddress(order.shippingAddress),
        price: totalPrice,
        shippingAmount: 0,
        tax: 0,
        consumer: {
          givenNames: order.shippingAddress.firstName,
          surname: order.shippingAddress.lastName,
          email: order.shippingAddress.email
        }
      };

      const { orderToken, paymentUrl } = await afterpayService.createCheckout(req.ctx, afterPayReq);

      await orderRepo.update(req.ctx, new UpdateOrderRequest(
        order.id,
        true,
        orderToken,
        undefined,
        undefined
      ));

      return {
        paymentUrl
      };
    } else {
      throw new BadRequestException(`Unsupported payment provider: ${order.paymentProvider}`);
    }
  }
}));

router.get("/", checkLoggedIn, wrap(async (req) => {
  const { shipped, paid, start, limit } = req.query;
  return await orderRepo.find(req.ctx, new FindOrderRequest(shipped, paid, start, limit));
}));

router.get("/count", checkLoggedIn, wrap(async (req) => {
  const { shipped, paid } = req.query;
  return await orderRepo.count(req.ctx, new FindOrderRequest(shipped, paid));
}));

router.get("/:id", checkLoggedIn, wrap(async (req) => {
  const params = req.params;
  return await orderRepo.get(req.ctx, new GetOrderByIdRequest(params.id));
}));

router.post("/:id", validate(orderSchema), checkAdmin, wrap(async (req) => {
  const params = req.params;
  const body = req.body;

  return await orderRepo.update(req.ctx, new UpdateOrderRequest(
    params.id,
    body.isPaid,
    body.transactionId,
    body.isShipped,
    body.trackingNumber,
  ));
}));


module.exports = router;
