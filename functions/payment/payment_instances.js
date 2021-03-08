const {EwayService} = require("./eway");
const {AfterpayService} = require('./afterpay')

const ewayService = new EwayService();
const afterpayService = new AfterpayService()

module.exports = {
  ewayService,
  afterpayService
}
