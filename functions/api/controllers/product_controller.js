const {
  CreateProductRequest,
  UpdateProductRequest,
  FindProductRequest,
  GetProductByIdRequest,
  ApplyDiscountRequest
} = require("../../db/product_repo");
const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const validate = require("../../helpers/validate");
const productSchema = require("../schema/product");

const { productRepo } = require("../../db/repo_instances");

const { checkAdmin } = require("../../middleware/authorization");

router.post(
  "/new",
  checkAdmin,
  validate(productSchema),
  wrap(async (req) => {
    const {
      displayName,
      discount,
      isNew,
      category,
      tags,
      configurations,
      variants,
      images,
      defaultImg,
      description,
      isFeatured,
      isDeleted,
    } = req.body;
    return await productRepo.create(
      req.ctx,
      new CreateProductRequest(
        displayName,
        discount,
        isNew,
        category,
        tags,
        configurations,
        variants,
        images,
        defaultImg,
        description,
        isFeatured,
        isDeleted,
      )
    );
  })
);

router.get(
  "/",
  wrap(async (req) => {
    const {
      category,
      featured,
      includeDeleted,
      displayName,
      skipImageMinting
    } = req.query;
    return await productRepo.find(req.ctx, new FindProductRequest(category, featured, includeDeleted, displayName, skipImageMinting));
  })
);

router.get(
  "/:id",
  wrap(async (req) => {
    const {
      includeConfigurations,
    } = req.query;
    return await productRepo.get(req.ctx, new GetProductByIdRequest(req.params.id, includeConfigurations));
  })
);

router.post(
  "/applyCommonDiscount",
  checkAdmin,
  wrap(async (req) => {
    const {
      discount,
    } = req.body;
    return await productRepo.applyDiscount(req.ctx, new ApplyDiscountRequest(discount));
  })
);

router.post(
  "/:id",
  checkAdmin,
  validate(productSchema),
  wrap(async (req) => {
    const { id } = req.params;
    const {
      displayName,
      discount,
      isNew,
      category,
      tags,
      configurations,
      variants,
      images,
      defaultImg,
      description,
      isFeatured,
      isDeleted,
    } = req.body;

    const updateReq = new UpdateProductRequest(
      id,
      displayName,
      discount,
      isNew,
      category,
      tags,
      configurations,
      variants,
      images,
      defaultImg,
      description,
      isFeatured,
      isDeleted,
    );

    return await productRepo.update(req.ctx, updateReq);
  })
);

module.exports = router;
