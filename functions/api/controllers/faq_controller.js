const {
  CreateFaqRequest,
  UpdateFaqRequest,
  FindFaqRequest,
  GetFaqByIdRequest,
} = require("../../db/faq_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const faqSchema = require("../schema/faq");

const { faqRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", validate(faqSchema), wrap(async (req) => {
  const body = req.body;
  return await faqRepo.create( req.ctx || {},new CreateFaqRequest(
    body.displayName,
    body.description,

  ));
}));

router.get("/", wrap(async (req) => {
  return await faqRepo.find(new FindFaqRequest());
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await faqRepo.get(new GetFaqByIdRequest(params.id));
}));

router.post("/:id", checkAdmin,  validate(faqSchema), wrap(async (req) => {
  const params = req.params;
  const body = req.body;
  const updateReq = new UpdateFaqRequest(
    params.id,
    body.displayName,
    body.description,
    body.isDeleted
  );

  return await faqRepo.update( req.ctx || {},updateReq);
}));


module.exports = router;
