const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const { selectPresent } = require("./repo_utils");
const admin = require("firebase-admin");

class Shipping {
  constructor(id, fee, zip) {
    this.id = id;
    this.fee = fee;
    this.zip = zip;
  }
}

class CreateShippingRequest {
  constructor(fee, zip) {
    this.fee = fee;
    this.zip = zip;
  }
}

class CreateShippingResponse {
  constructor(shipping) {
    this.shipping = shipping;
  }
}

class UpdateShippingRequest {
  constructor(id, fee, zip) {
    this.id = id;
    this.fee = fee;
    this.zip = zip;
  }
}

class UpdateShippingResponse {
  constructor(shipping) {
    this.shipping = shipping;
  }
}

class GetShippingByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetShippingByIdResponse {
  constructor(shipping) {
    this.shipping = shipping;
  }
}

class GetShippingByZipRequest {
  constructor(zip) {
    this.zip = zip;
  }
}

class GetShippingByZipResponse {
  constructor(shipping) {
    this.shipping = shipping;
  }
}

class FindShippingRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindShippingResponse {
  constructor(shippings) {
    this.shippings = shippings;
  }
}

class ShippingRepo {
  constructor(firestore) {
    this.db = firestore;
    this.collection = firestore.collection("shipping");
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const data = {
        fee: req.fee,
        zip: req.zip,
      };

      t.create(docRef, data);

      return new CreateShippingResponse(new Shipping(id, data.fee, data.zip));
    });
  }

  async get(ctx, req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data || (data.isDeleted && !ctx.isAdmin())) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }

    return new GetShippingByIdResponse(
      new Shipping(doc.id, data.fee, data.zip)
    );
  }

  async getByZipCode(ctx, req) {
    let query = this.collection;
    query = query.where("zip", "==", parseInt(req.zip));

    const snapshot = await query.get();

    let result = null;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!(data.isDeleted && !ctx.isAdmin())) {
        result = new Shipping(doc.id, data.fee, data.zip);
      }
    });

    if (!result) {
      throw new NotFoundException(`Document with zip not found: ${req.zip}`);
    }

    return new GetShippingByZipResponse(result);
  }

  async find(ctx, req) {
    let query = this.collection;
    if (req.ids && req.ids.length > 0) {
      query = query.where(
        admin.firestore.FieldPath.documentId(),
        "in",
        req.ids
      );
    }

    const snapshot = await query.get();

    const result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(new Shipping(doc.id, data.fee, data.zip));
    });

    return new FindShippingResponse(result);
  }

  async update(ctx, req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }

      data.fee = selectPresent(req.fee, data.fee);
      data.zip = selectPresent(req.zip, data.zip);

      t.update(docRef, data);

      return new UpdateShippingResponse(
        new Shipping(doc.id, data.fee, data.zip)
      );
    });
  }
}

module.exports = {
  ShippingRepo,
  CreateShippingRequest,
  CreateShippingResponse,
  UpdateShippingRequest,
  UpdateShippingResponse,
  GetShippingByIdRequest,
  GetShippingByIdResponse,
  FindShippingRequest,
  FindShippingResponse,
  GetShippingByZipRequest,
};
