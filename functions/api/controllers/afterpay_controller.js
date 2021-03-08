const {
  UpdateOrderRequest,
  GetOrderByTransactionIdRequest,
} = require("../../db/order_repo");

const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const Redirect = require("./redirect");

const { orderRepo } = require("../../db/repo_instances");
const { afterpayService } = require("../../payment/payment_instances");


router.get("/validate", wrap(async (req) => {
  const { status, orderToken } = req.query;
  const orderConfirmUrl = functions.config().host.web + '/other/order-confirm';
  const success = status === "SUCCESS";
  if (!success) {
    return new Redirect(
      `${orderConfirmUrl}?success=false&errors=${JSON.stringify(["Order was cancelled"])}`
    )
  }

  try {
    const { order } = await orderRepo.getByTransactionId(req.ctx, new GetOrderByTransactionIdRequest(orderToken));
    if (!order) {
      return new Redirect(
        `${orderConfirmUrl}?success=false&errors=${JSON.stringify([`Order '${orderToken}' not found!`])}`
      )
    }

    const paymentStatus = await afterpayService.checkPayment(req.ctx, { token: orderToken });

    if (!paymentStatus.success) {
      return new Redirect(
        `${orderConfirmUrl}?success=false&errors=${JSON.stringify(["Payment was not successful!"])}`
      )
    }

    await orderRepo.update(req.ctx, new UpdateOrderRequest(
      order.id,
      true,
      orderToken,
      undefined,
      undefined
    ));

    return new Redirect(
      `${orderConfirmUrl}?success=true&transactionId=${orderToken}`
    )
  } catch (err) {
    console.log(err);
    const errors = [
      `Payment has failed. Please contact us and mention this transaction id: ${orderToken}.`
    ]
    return new Redirect(
      `${orderConfirmUrl}?success=false&errors=${JSON.stringify(errors)}`
    );
  }
}));

module.exports = router;
