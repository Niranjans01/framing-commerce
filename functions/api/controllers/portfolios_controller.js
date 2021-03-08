const {
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  FindPortfolioRequest,
  GetPortfolioByIdRequest,
} = require("../../db/portfolio_repo");

const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");

const validate = require("../../helpers/validate");
const portfolioSchema = require("../schema/portfolio");

const { portfolioRepo } = require("../../db/repo_instances");
const { checkAdmin, checkLoggedIn } = require("../../middleware/authorization");

router.post("/new", validate(portfolioSchema), wrap(async (req) => {
  const body = req.body;
  return await portfolioRepo.create( req.ctx || {},new CreatePortfolioRequest(
    body.displayName,
    body.description,
    body.category,
    body.image,
  ));
}));

router.get("/",  wrap(async (req) => {
  return await portfolioRepo.find(req.ctx, new FindPortfolioRequest());
}));

router.get("/:id", wrap(async (req) => {
  const params = req.params;
  return await portfolioRepo.get(req.ctx, new GetPortfolioByIdRequest(params.id));
}));

router.post("/:id", checkAdmin, validate(portfolioSchema),  wrap(async (req) => {
  const params = req.params;
  const body = req.body;

  return await portfolioRepo.update( req.ctx || {},new UpdatePortfolioRequest(
    params.id,
    body.displayName,
    body.description,
    body.category,
    body.image,
    body.isDeleted,
  ));
}));


module.exports = router;
