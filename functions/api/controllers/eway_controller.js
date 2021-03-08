const {
  UpdateOrderRequest,
  GetOrderByIdRequest,
} = require("../../db/order_repo");

const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const Redirect = require("./redirect");

const { orderRepo } = require("../../db/repo_instances");
const { ewayService } = require("../../payment/payment_instances");

router.get("/validate", wrap(async (req) => {
  const { AccessCode } = req.query;
  const {
    success,
    transactionId,
    orderId,
    errors,
  } = await ewayService.confirmPayment(req.ctx, { accessCode: AccessCode });
  const orderConfirmUrl = functions.config().host.web + '/other/order-confirm';
  if (!success) {
    return new Redirect(
      `${orderConfirmUrl}?success=false&errors=${JSON.stringify(errors)}`
    )
  }

  try {
    await orderRepo.update(req.ctx, new UpdateOrderRequest(
      orderId,
      true,
      transactionId,
      undefined,
      undefined
    ));

    return new Redirect(
      `${orderConfirmUrl}?success=true&transactionId=${transactionId}`
    )
  } catch (err) {
    console.log(err);
    const errors = [
      `Payment has succeeded, but post payment processing has failed. Please contact us and mention this transaction id: ${transactionId}.`
    ]
    return new Redirect(
      `${orderConfirmUrl}?success=false&errors=${JSON.stringify(errors)}`
    );
  }
}));

module.exports = router;
