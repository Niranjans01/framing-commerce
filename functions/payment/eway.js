const rapid = require("eway-rapid");
const functions = require("firebase-functions");

class EwayService {
  constructor() {
    const config = functions.config().eway;
    this.client = rapid.createClient(
      config.key,
      config.password,
      config.endpoint,
    );
  }

  async createPayment(ctx, { orderId, totalPrice, redirectUrl, cancelUrl }) {
    const ewayReq = {
      Payment: {
        TotalAmount: Math.floor(totalPrice),
        InvoiceReference: orderId,
        InvoiceNumber: orderId,
        Currency: "AUD",
      },
      RedirectUrl: redirectUrl,
      CancelUrl: cancelUrl,
      TransactionType: "Purchase",
    };

    functions.logger.log("Creating eway payment", {ewayReq});

    let ewayRes;
    try {
      ewayRes = await this.client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, ewayReq);
      functions.logger.log("Got eway response for create payment", ewayRes);
    } catch (err) {
      console.log(err);
      return this._processErrors(err.getErrors());
    }

    if (!ewayRes) {
      throw new Error("ewayRes is null!");
    }

    if (ewayRes.getErrors().length > 0) {
      console.log(ewayRes);
      return this._processErrors(ewayRes.getErrors());
    }

    return {
      paymentUrl: ewayRes.get("SharedPaymentUrl")
    };
  }

  async confirmPayment(ctx, { accessCode }) {
    try {
      const ewayResp = await this.client.queryTransaction(accessCode);
      if (!ewayResp.get("Transactions[0].TransactionStatus")) {
        const messages = ewayResp.get("Transactions[0].ResponseMessage").split(", ").map(err => rapid.getMessage(err, "en"));
        return {
          success: false,
          errors: messages,
        }
      }
      const transactionId = ewayResp.get("Transactions[0].TransactionID").toString();
      const orderId = ewayResp.get("Transactions[0].InvoiceReference");
      return {
        success: true,
        transactionId,
        orderId
      }
    } catch (err) {
      const messages = err.getErrors().map(err => rapid.getMessage(err, "en"));
      return {
        success: false,
        errors: messages,
      }
    }
  }

  _processErrors(errors) {
    let msg = "Request failed due to: \n"

    errors.forEach(error => {
      msg += `\t${rapid.getMessage(error, "en")}`;
    });

    throw new Error(msg);
  }
}


module.exports = {
  EwayService,
}
