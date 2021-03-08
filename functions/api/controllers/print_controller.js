const {
  CreatePrintRequest,
  UpdatePrintRequest,
  FindPrintRequest,
  GetPrintByIdRequest,
} = require("../../db/print_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const printSchema = require("../schema/print");

const { printRepo } = require("../../db/repo_instances")
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", checkAdmin, validate(printSchema), wrap(async (req) => {
  const body = req.body;
  return await printRepo.create(req.ctx, new CreatePrintRequest(
    body.displayName,
    body.description,
    body.priceCode,
    body.discount,
    body.isNew,
    body.isDeleted,
  ));
}));

router.get("/", wrap(async (req) => {
  const { ids, includeDeleted} = req.query;
  return await printRepo.find(req.ctx, new FindPrintRequest(ids, includeDeleted));
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await printRepo.get(req.ctx, new GetPrintByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(printSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;
  const updateReq = new UpdatePrintRequest(
    params.id,
    body.displayName,
    body.description,
    body.priceCode,
    body.discount,
    body.isNew,
    body.isDeleted,
    body.isDefault
  );

  return await printRepo.update(req.ctx, updateReq);
}));


module.exports = router;
