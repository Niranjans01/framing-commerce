const priceMatrixModel = require("../models/price_matrix");
const express = require("express");
const router = express.Router();



    //get price-matrix
  router.get("/getPriceMatrix", (req, res) => {
    (async () => {
      try {
        let res_doc = await priceMatrixModel.get();
        return res.status(200).send(res_doc);
      } catch (error) {
        throw new ErrorHandler(500, error);
      }
    })();
  });

  module.exports = router;