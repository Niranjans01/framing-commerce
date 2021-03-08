const { createInstance } = require("./lib/utilities");
const yargs = require('yargs');

var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage("Usage: $0 --host [host] (--auth [auth])")
  .option("host", {
    type: "string",
    description: "Host to run populator with."
  })
  .option("auth", {
    type: "string",
    description: "Optional auth token, required for non local hosts."
  })
  .demandOption("host")
  .help()
  .argv;

const host = argv.host;
const auth = argv.auth;

const api = createInstance(host, auth);

const { populatePriceCode } = require('./scripts/price_code_script')
const { populateBacking } = require('./scripts/backing_script');
const { populateEdgeWidth } = require('./scripts/edge_width_script');
const { populateEdge } = require('./scripts/edge_script');
const { populateMirrorType } = require('./scripts/mirror_type_script');
const { populateFrame } = require('./scripts/frame_script');
const { populateGlass } = require('./scripts/glass_script');
const { populateMat } = require('./scripts/mat_script');
const { populatePrint } = require('./scripts/print_script');
const { populateStretch } = require('./scripts/stretching_script');
const { populateDimension } = require("./scripts/dimension_script");
const { populateMirror } = require("./scripts/mirror_script");
const { populateClipFrames } = require("./scripts/clip_frames_script");
const { populateAcrylicFloat } = require("./scripts/acrylic_float_script");
const { populateArtMounts } = require("./scripts/art_mounts_script");
const { populateCanvasPrints } = require("./scripts/canvas_printing_script");
const { populateCertificates } = require("./scripts/certificates_script");
const { populateChalks } = require("./scripts/chalks_script");
const { populateCorks } = require("./scripts/corks_script");
const { populatePictureFraming } = require('./scripts/picture_framing_script');
const { populateMirrorShop } = require('./scripts/mirror_shop');
const { populateShipping } = require('./scripts/shipping_script');
const { populateFaq } = require('./scripts/faq');
const { populatePortfolio } = require('./scripts/portfolio');

async function populate() {
  const priceCodes = await populatePriceCode(api);

  //configurations
  const backings = await populateBacking(priceCodes, api);
  const edges = await populateEdge(priceCodes, api);
  const edgeWidths = await populateEdgeWidth(priceCodes, api);
  const frames = await populateFrame(priceCodes, api);
  const glasses = await populateGlass(priceCodes, api);
  const mats = await populateMat(priceCodes, api);
  const mirrorTypes = await populateMirrorType(priceCodes, api);
  const prints = await populatePrint(priceCodes, api);
  const stretches = await populateStretch(priceCodes, api);
  const dimensions = await populateDimension(api);

 // products
  const mirrors = await populateMirror(mirrorTypes, frames, dimensions, api);
  const clipFrames = await populateClipFrames(dimensions, prints, api);
  const acrylicFloatFrames = await populateAcrylicFloat(dimensions, prints, edgeWidths, api);
  const artMounts = await populateArtMounts(dimensions, prints, edges, edgeWidths, api);
  const canvasPrints = await populateCanvasPrints(dimensions, prints, stretches, edges, frames, api);
  const certificates = await populateCertificates(dimensions, backings, glasses, mats, frames, api)
  const chalks = await populateChalks(dimensions, backings, frames, api)
  const corks = await populateCorks(dimensions, backings, frames, api)
  const pictureFramings = await populatePictureFraming(dimensions, backings, prints, glasses, mats, frames, api)
  const mirrorShop = await populateMirrorShop(api);
  const shipping = await populateShipping(api);
  const faq = await populateFaq(api);
  const portfolio = await populatePortfolio(api);
}

populate().catch(err => console.log(err));
