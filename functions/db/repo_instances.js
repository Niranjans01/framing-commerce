const firestore = require("../firebase/firestore");

const { DimensionRepo } = require("./dimension_repo");
const { StretchingRepo } = require("./stretching_repo");
const { MirrorRepo } = require("./mirror_repo");
const { PrintRepo } = require("./print_repo");
const { FaqRepo } = require("./faq_repo");
const { EdgeRepo } = require("./edge_repo");
const { GlassRepo } = require("./glass_repo");
const { ImageRepo } = require("./image_repo");
const { BackingRepo } = require("./backing_repo");
const { EdgeWidthRepo } = require("./edge_width_repo");
const { PriceCodeRepo } = require("./price_code_repo");
const { PortfolioRepo } = require("./portfolio_repo");
const { FrameRepo } = require("./frame_repo");
const { MatRepo } = require("./mat_board_repo");
const { UserRepo } = require("./user_repo");
const { GiftRepo } = require("./gift_repo");
const { OrderRepo } = require("./order_repo");
const { CouponRepo } = require("./coupon_repo");
const { CouponClaimRepo } = require("./coupon_claims_repo");
const { ProductRepo } = require("./product_repo");
const { ShippingRepo } = require("./shipping_repo");

const imageRepo = new ImageRepo(firestore);
const userRepo = new UserRepo(firestore);

const backingRepo = new BackingRepo(firestore);
const dimensionRepo = new DimensionRepo(firestore);
const edgeRepo = new EdgeRepo(firestore, imageRepo);
const edgeWidthRepo = new EdgeWidthRepo(firestore);
const frameRepo = new FrameRepo(firestore, imageRepo);
const glassRepo = new GlassRepo(firestore);
const matRepo = new MatRepo(firestore, imageRepo);
const portfolioRepo = new PortfolioRepo(firestore, imageRepo);
const mirrorRepo = new MirrorRepo(firestore);
const printRepo = new PrintRepo(firestore);
const stretchingRepo = new StretchingRepo(firestore);
const priceCodeRepo = new PriceCodeRepo(firestore);
const couponRepo = new CouponRepo(firestore);
const shippingRepo = new ShippingRepo(firestore);
const giftRepo = new GiftRepo(firestore);
const couponClaimsRepo = new CouponClaimRepo(firestore);
const productRepo = new ProductRepo(
  firestore,
  userRepo,
  backingRepo,
  dimensionRepo,
  edgeRepo,
  edgeWidthRepo,
  frameRepo,
  glassRepo,
  matRepo,
  mirrorRepo,
  printRepo,
  stretchingRepo,
  imageRepo
);
const orderRepo = new OrderRepo(
  firestore,
  userRepo,
  backingRepo,
  dimensionRepo,
  edgeRepo,
  edgeWidthRepo,
  frameRepo,
  glassRepo,
  matRepo,
  mirrorRepo,
  printRepo,
  stretchingRepo,
  imageRepo,
  priceCodeRepo,
  productRepo,
  couponRepo,
  giftRepo,
  couponClaimsRepo
);

module.exports = {
  backingRepo,
  dimensionRepo,
  imageRepo,
  mirrorRepo,
  stretchingRepo,
  printRepo,
  faqRepo: new FaqRepo(firestore),
  edgeRepo,
  glassRepo,
  edgeWidthRepo,
  priceCodeRepo,
  portfolioRepo,
  frameRepo,
  matRepo,
  userRepo,
  giftRepo,
  orderRepo,
  couponRepo,
  couponClaimsRepo,
  productRepo,
  shippingRepo,
};
