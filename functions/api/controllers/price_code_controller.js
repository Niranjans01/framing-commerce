const {
  CreatePriceCodeRequest,
  UpdatePriceCodeRequest,
  FindPriceCodeRequest,
  GetPriceCodeByIdRequest,
} = require("../../db/price_code_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const { priceCodeRepo } = require("../../db/repo_instances")
const { checkAdmin } = require("../../middleware/authorization");

const validate = require("../../helpers/validate");
const schema = require("../schema/price_code");

router.post("/new", validate(schema), checkAdmin, wrap(async (req) => {
  const body = req.body;
  return await priceCodeRepo.create(new CreatePriceCodeRequest(
    body.displayName,
    body.multiplier,
    body.prices,
  ));
}));

router.get("/", wrap(async (req) => {
  const query = req.query;
  return await priceCodeRepo.find(new FindPriceCodeRequest(query.ids, query.displayName));
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  console.log(params);
  return await priceCodeRepo.get(new GetPriceCodeByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(schema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;
  const updateReq = new UpdatePriceCodeRequest(
    params.id,
    body.displayName,
    body.multiplier,
    body.prices,
  );

  return await priceCodeRepo.update(updateReq);
}));


module.exports = router;
