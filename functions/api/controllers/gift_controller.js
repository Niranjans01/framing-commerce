const {
  CreateGiftRequest,
  UpdateGiftRequest,
  FindGiftRequest,
  GetGiftByIdRequest,
} = require("../../db/gift_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const giftSchema = require("../schema/gift");

const { giftRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post(
  "/new",
  validate(giftSchema),
  wrap(async (req) => {
    const {
      recipientName,
      recipientEmail,
      senderName,
      message,
      amount,
      expiryDate,
      isClaimed,
    } = req.body;
    return await giftRepo.create(
      new CreateGiftRequest(
        recipientName,
        recipientEmail,
        senderName,
        message,
        amount,
        expiryDate,
        isClaimed
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    return await giftRepo.find(new FindGiftRequest());
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const params = req.params;
    return await giftRepo.get(new GetGiftByIdRequest(params.id));
  })
);

router.post(
  "/:id", checkAdmin,
  validate(giftSchema),
  wrap(async (req) => {
    const { id } = req.params;
    const {
      recipientName,
      recipientEmail,
      senderName,
      message,
      amount,
      expiryDate,
      isClaimed,
    } = req.body;
    const updateReq = new UpdateGiftRequest(
      id,
      recipientName,
      recipientEmail,
      senderName,
      message,
      amount,
      expiryDate,
      isClaimed
    );

    return await giftRepo.update(updateReq);
  })
);

module.exports = router;
