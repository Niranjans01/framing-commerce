const {
  CreateUserRequest,
  UpdateUserRequest,
  FindUserRequest,
  GetUserByIdRequest,
  DeleteByIdRequest,
} = require("../../db/user_repo");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const userSchema = require("../schema/user");
const {checkLoggedIn} = require("../../middleware/authorization");

const { userRepo } = require("../../db/repo_instances");

router.get(
  "/",
  checkLoggedIn,
  wrap(async (req) => {
    return await userRepo.find(new FindUserRequest());
  })
);

router.get(
  "/:id",
  checkLoggedIn,
  wrap(async (req) => {
    const params = req.params;
    return await userRepo.get(new GetUserByIdRequest(params.id));
  })
);

router.post(
  "/:id",
  checkLoggedIn,
  validate(userSchema),
  wrap(async (req) => {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      isDeleted,
      shippingAddress,
      phoneNumber,
      isSubscribed,
    } = req.body;

    const updateReq = new UpdateUserRequest(
      id,
      firstName,
      lastName,
      isDeleted,
      shippingAddress,
      phoneNumber,
      isSubscribed,
      undefined
    );

    return await userRepo.update(updateReq);
  })
);

module.exports = router;
