const functions = require("./firebase/functions");
const express = require("express");
const app = express(); //create ExpressJS app
// Automatically allow cross-origin requests
const cors = require("cors");

const {
  NotFoundException,
  BadRequestException,
  ForbiddenAccessException
} = require("./requests/exceptions");

const { extractRequestContext, enhanceContext } = require("./middleware/authorization");

app.use(cors({ origin: true }));

// disable caching
app.use((req, res, next) => {
  res.set("etag", false);
  res.set("Cache-Control", "no-store");
  next();
});


app.use(express.json());

app.use(extractRequestContext);
app.use(enhanceContext);


// todo: remove
app.use("/users", require("./api/controllers/users_controller"));
app.use("/user", require("./api/controllers/users_controller"));

// todo: remove
app.use("/portfolios", require("./api/controllers/portfolios_controller"));
app.use("/portfolio", require("./api/controllers/portfolios_controller"));


//export the api to firebase cloud functions
app.use("/order", require("./api/controllers/orders_controller"));
app.use("/eway", require("./api/controllers/eway_controller"));
app.use("/afterpay", require("./api/controllers/afterpay_controller"));
app.use("/faq", require("./api/controllers/faq_controller"));
app.use("/backing", require("./api/controllers/backing_controller"));
app.use("/dimension", require("./api/controllers/dimension_controller"));
app.use("/edge-width", require("./api/controllers/edge_width_controller"));
app.use("/stretching", require("./api/controllers/stretching_controller"));
app.use("/mirror", require("./api/controllers/mirror_controller"));
app.use("/print", require("./api/controllers/print_controller"));
app.use("/edge", require("./api/controllers/edge_controller"));
app.use("/glass", require("./api/controllers/glass_controller"));
app.use("/image", require("./api/controllers/image_controller"));
app.use("/price-code", require("./api/controllers/price_code_controller"));
app.use("/frame", require("./api/controllers/frames_controller"));
app.use("/mat", require("./api/controllers/mat_board_controller"));
app.use("/coupon", require("./api/controllers/coupon_contoller"));
app.use("/coupon-claims", require("./api/controllers/coupon_claim_controller"));
app.use("/gift", require("./api/controllers/gift_controller"));
app.use("/product", require("./api/controllers/product_controller"));
app.use("/contactUs", require("./api/controllers/contact_us_controller"));
app.use("/search-engine", require("./api/controllers/search_engine_controller"));
app.use("/shipping", require("./api/controllers/shipping_controller"));

// error handling
app.use((err, req, res, next) => {
  if (err instanceof NotFoundException) {
    res.status(404).send(err.message);
  } else if (err instanceof BadRequestException) {
    res.status(400).send(err.message);
  } else if (err instanceof ForbiddenAccessException) {
    res.status(403).send(err.message);
  } else {
    console.log(err);
    res.status(500).send("An unexpected error has occurred!");
  }
});

//export the api to firebase cloud functions
exports.api = functions.https.onRequest(app);

// triggers
exports = Object.assign(
  exports,
  require("./triggers/edge"),
  require("./triggers/product"),
  require("./triggers/user"),
  require("./triggers/order"),
  require("./triggers/users"),
  require("./triggers/mat"),
  require("./triggers/portfolio"),
  require("./triggers/frame")
)
