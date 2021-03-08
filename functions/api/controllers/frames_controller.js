const {
    CreateFrameRequest,
    UpdateFrameRequest,
    FindFrameRequest,
    GetFrameByIdRequest,
} = require("../../db/frame_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const frameSchema = require("../schema/frame");


const { frameRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkAdmin, validate(frameSchema), wrap(async (req) => {
    const body = req.body;
    return await frameRepo.create(
      req.ctx,
      new CreateFrameRequest(
        body.displayName,
        body.priceCode,
        body.horizontalBorderImage,
        body.verticalBorderImage,
        body.width,
        body.height,
        body.rebate,
        body.color,
        body.material,
        body.isDeleted,
        body.isDefault,
        body.isOrnate,
        body.info
      )
    );
}));

router.get("/", wrap(async (req) => {
  const { ids, includeDeleted } = req.query;
    return await frameRepo.find(req.ctx, new FindFrameRequest(ids, includeDeleted));
}));

router.get("/:id", wrap(async (req) => {
    const params = req.params;
    return await frameRepo.get(req.ctx, new GetFrameByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(frameSchema), wrap(async (req) => {
    const params = req.params;
    const body = req.body;
    return await frameRepo.update(
      req.ctx,
      new UpdateFrameRequest(
        params.id,
        body.displayName,
        body.priceCode,
        body.horizontalBorderImage,
        body.verticalBorderImage,
        body.width,
        body.height,
        body.rebate,
        body.color,
        body.material,
        body.isDeleted,
        body.isDefault,
        body.isOrnate,
        body.info
      )
    );
}));


module.exports = router;
