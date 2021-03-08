const admin = require("firebase-admin");

const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");

class PriceCode {
  constructor(
    id,
    displayName,
    multiplier,
    prices,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.multiplier = multiplier;
    this.prices = prices;
  }
}

class CreatePriceCodeRequest {
  constructor(
    displayName,
    multiplier,
    prices
  ) {
    this.displayName = displayName;
    this.multiplier = multiplier;
    this.prices = prices;
  }
}

class CreatePriceCodeResponse {
  constructor(
    priceCode
  ) {
    this.priceCode = priceCode;
  }
}

class GetPriceCodeByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetPriceCodeByIdResponse {
  constructor(
    priceCode
  ) {
    this.priceCode = priceCode;
  }
}

class FindPriceCodeRequest {
  constructor(ids, displayName) {
    this.ids = ids;
    this.displayName = displayName;
  }
}

class FindPriceCodeResponse {
  constructor(priceCodes) {
    this.priceCodes = priceCodes;
  }
}

class UpdatePriceCodeRequest {
  constructor(
    id,
    displayName,
    multiplier,
    prices
  ) {
    this.id = id;
    this.displayName = displayName;
    this.multiplier = multiplier;
    this.prices = prices;
  }
}

class UpdatePriceCodeResponse {
  constructor(
    priceCode
  ) {
    this.priceCode = priceCode;
  }
}

class PriceCodeRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("price_code");
  }

  async create(req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const data = {
        displayName: req.displayName,
        multiplier: req.multiplier,
        prices: req.prices,
      };

      t.create(docRef, data);

      return new CreatePriceCodeResponse(
        new PriceCode(
          id,
          data.displayName,
          data.multiplier,
          data.prices,
        ),
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

    return new GetPriceCodeByIdResponse(
      new PriceCode(
        doc.id,
        data.displayName,
        data.multiplier,
        data.prices,
      ),
    );
  }

  async find(req) {
    let query = this.collection;
    if (req.displayName) {
      query = query.where("displayName", "==", req.displayName);
    }
    if (req.ids && req.ids.length > 0) {
      query = query.where(admin.firestore.FieldPath.documentId(), "in", req.ids);
    }

    const snapshot = await query.get();
    const result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(new PriceCode(
        doc.id,
        data.displayName,
        data.multiplier,
        data.prices,
      ));
    });

    return new FindPriceCodeResponse(result);
  }

  async update(req) {
    const docRef = this.collection.doc(req.id);
    console.log(`updating ${JSON.stringify(req)}`);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }

      data.displayName = req.displayName || data.displayName;
      data.multiplier = req.multiplier || data.multiplier;
      data.prices = (req.prices || data.prices) === undefined ? null : data.prices;


      t.update(docRef, data);
      return new UpdatePriceCodeResponse(
        new PriceCode(
          doc.id,
          data.displayName,
          data.multiplier,
          data.prices,
        ),
      );
    });
  }
}

module.exports = {
  CreatePriceCodeRequest,
  CreatePriceCodeResponse,
  UpdatePriceCodeRequest,
  UpdatePriceCodeResponse,
  GetPriceCodeByIdRequest,
  GetPriceCodeByIdResponse,
  FindPriceCodeRequest,
  FindPriceCodeResponse,
  PriceCodeRepo,
};
