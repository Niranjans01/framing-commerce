const axios = require("axios");
const functions = require("firebase-functions");

class AfterpayService {
  constructor() {
    const config = functions.config().afterpay;
    const auth = Buffer.from(`${config.id}:${config.key}`).toString("base64");
    const headers = {
      "Authorization": `Basic ${auth}`
    }
    this.afterpay = axios.create({
      baseURL: config.url,
      headers,
    });
  }

  async getConfiguration(ctx) {
    try {
      const configuration = await this.afterpay.get('/configuration').then(res => res.data);

      const minimumAmount = configuration.minimumAmount ? configuration.minimumAmount.amount : null;
      const maximumAmount = configuration.maximumAmount ? configuration.maximumAmount.amount : null;

      return {
        minimumAmount,
        maximumAmount
      }
    } catch (err) {
      throw err;
    }
  }

  async createCheckout(ctx, { orderId, redirectUrl, cancelUrl, price, consumer, billing, shipping, tax, shippingAmount }) {
    try {
      const currency = "AUD"
      const params = {
        amount : {
          amount: price,
          currency
        },
        consumer,
        billing,
        shipping,
        merchant : {
          redirectConfirmUrl: redirectUrl,
          redirectCancelUrl: cancelUrl
        },
        taxAmount: {
          amount: tax,
          currency
        },
        shippingAmount: {
          amount: shippingAmount,
          currency
        },
        merchantReference: orderId
      }
      const { token, redirectCheckoutUrl } = await this.afterpay.post('/checkouts', params).then(res => res.data);
      return {
        orderToken: token,
        paymentUrl: redirectCheckoutUrl
      }
    } catch (err) {
      throw err;
    }
  }

  async checkPayment(ctx, { token }) {
    try {
      const { status } = await this.afterpay.post(`/payments/capture`, { token }).then(res => res.data);

      return {
        success: status === "APPROVED"
      }
    } catch (err) {
      throw err;
    }
  }

}


module.exports = {
  AfterpayService,
}
