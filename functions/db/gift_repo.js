const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");

class Base {
  constructor(
    recipientName,
    recipientEmail,
    senderName,
    message,
    amount,
    expiryDate,
    isClaimed
  ) {
    this.recipientName = recipientName;
    this.recipientEmail = recipientEmail;
    this.senderName = senderName;
    this.message = message;
    this.amount = amount;
    this.expiryDate = expiryDate;
    this.isClaimed = isClaimed;
  }
}

class Gift extends Base {
  constructor(
    id,
    recipientName,
    recipientEmail,
    senderName,
    message,
    amount,
    expiryDate,
    isClaimed
  ) {
    super(
      recipientName,
      recipientEmail,
      senderName,
      message,
      amount,
      expiryDate,
      isClaimed
    );
    this.id = id;
  }
}

class CreateGiftRequest extends Base {}

class CreateGiftResponse {
  constructor(gift) {
    this.gift = gift;
  }
}

class UpdateGiftRequest extends Gift {}

class UpdateGiftResponse extends CreateGiftResponse {}

class GetGiftByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetGiftByIdResponse extends CreateGiftResponse {}

class FindGiftRequest {
  constructor() {}
}

class FindGiftResponse {
  constructor(gifts) {
    this.gifts = gifts;
  }
}

class GiftRepo {
  constructor(firestore) {
    this.db = firestore;
    this.collection = firestore.collection("gifts");
  }

  async create(req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const {
        recipientName = "",
        recipientEmail = "",
        senderName = "",
        message = "",
        amount = 0,
        expiryDate = null,
        isClaimed = false,
      } = req;

      const docRef = this.collection.doc(id);
      const data = {
        id,
        recipientName,
        recipientEmail,
        senderName,
        message,
        amount,
        expiryDate,
        isClaimed,
      };
      t.create(docRef, data);

      return new CreateGiftResponse(
        new Gift(
          data.id,
          data.recipientName,
          data.recipientEmail,
          data.senderName,
          data.message,
          data.amount,
          data.expiryDate,
          data.isClaimed
        )
      );
    });
  }

  async get(req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }
    return new GetGiftByIdResponse(
      new Gift(
        data.id,
        data.recipientName,
        data.recipientEmail,
        data.senderName,
        data.message,
        data.amount,
        data.expiryDate,
        data.isClaimed
      )
    );
  }

  async find(req) {
    const snapshot = await this.collection.get();
    const result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(
        new Gift(
          data.id,
          data.recipientName,
          data.recipientEmail,
          data.senderName,
          data.message,
          data.amount,
          data.expiryDate,
          data.isClaimed
        )
      );
    });

    return new FindGiftResponse(result);
  }

  async update(req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }
      const {
        recipientName = data.recipientName,
        recipientEmail = data.recipientEmail,
        senderName = data.senderName,
        message = data.message,
        amount = data.amount,
        expiryDate = data.expiryDate,
        isClaimed = data.isClaimed,
      } = req;

      data.recipientName = recipientName;
      data.recipientEmail = recipientEmail;
      data.senderName = senderName;
      data.message = message;
      data.amount = amount;
      data.expiryDate = expiryDate;
      data.isClaimed = isClaimed;

      t.update(docRef, data);
      return new UpdateGiftResponse(
        new Gift(
          data.id,
          data.recipientName,
          data.recipientEmail,
          data.senderName,
          data.message,
          data.amount,
          data.expiryDate,
          data.isClaimed
        )
      );
    });
  }
}

module.exports = {
  GiftRepo,
  CreateGiftRequest,
  CreateGiftResponse,
  UpdateGiftRequest,
  UpdateGiftResponse,
  GetGiftByIdRequest,
  GetGiftByIdResponse,
  FindGiftRequest,
  FindGiftResponse,
};
