const shortid = require("shortid");
const {
  NotFoundException
} = require("../requests/exceptions");
const admin = require("firebase-admin");
const {selectPresent} = require("./repo_utils");

class Stretching {
  constructor(
    id,
    displayName,
    description,
    isNew,
    priceCode,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
  }
}

class CreateStretchingRequest {
  constructor(
    displayName,
    description,
    isNew,
    priceCode,
    isDeleted,
  ) {
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
  }
}

class CreateStretchingResponse {
  constructor(stretching) {
    this.stretching = stretching;
  }
}

class UpdateStretchingRequest {
  constructor(
    id,
    displayName,
    description,
    isNew,
    priceCode,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
  }
}

class UpdateStretchingResponse {
  constructor(stretching) {
    this.stretching = stretching;
  }
}


class GetStretchingByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetStretchingByIdResponse {
  constructor(stretching) {
    this.stretching = stretching;
  }
}

class FindStretchingRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindStretchingResponse {
  constructor(stretchings) {
    this.stretchings = stretchings;
  }
}

class StretchingRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("stretching");
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const data = {
        displayName: req.displayName,
        description: req.description,
        isNew: req.isNew,
        priceCode: req.priceCode,
        isDeleted: req.isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateStretchingResponse(
        new Stretching(
          id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.isDeleted,
        ),
      );
    });
  }

  async get(ctx, req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data || (data.isDeleted && !ctx.isAdmin())) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }

    return new GetStretchingByIdResponse(
      new Stretching(
        doc.id,
        data.displayName,
        data.description,
        data.isNew,
        data.priceCode,
        data.isDeleted
      ),
    );
  }

  async find(ctx, req) {
    let query = this.collection;
    if (req.ids && req.ids.length > 0) {
      query = query.where(admin.firestore.FieldPath.documentId(), "in", req.ids);
    }

    if (!ctx.isAdmin() || !req.includeDeleted) {
      query = query.where("isDeleted", "==", false);
    }

    const snapshot = await query.get();
    const result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(new Stretching(
        doc.id,
        data.displayName,
        data.description,
        data.isNew,
        data.priceCode,
        data.isDeleted,
      ));
    });

    return new FindStretchingResponse(result);
  }

  async update(ctx, req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }

      data.displayName = selectPresent(req.displayName, data.displayName);
      data.description = selectPresent(req.description, data.description);
      data.isNew = selectPresent(req.isNew, data.isNew);
      data.priceCode = selectPresent(req.priceCode, data.priceCode);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);

      t.update(docRef, data);
      return new UpdateStretchingResponse(
        new Stretching(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.isDeleted,
        ),
      );
    });
  }
}

module.exports = {
  StretchingRepo,
  CreateStretchingRequest,
  CreateStretchingResponse,
  UpdateStretchingRequest,
  UpdateStretchingResponse,
  GetStretchingByIdRequest,
  GetStretchingByIdResponse,
  FindStretchingRequest,
  FindStretchingResponse,
};
