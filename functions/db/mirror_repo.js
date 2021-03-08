const shortid = require("shortid");
const {
  NotFoundException
} = require("../requests/exceptions");
const admin = require("firebase-admin");
const {selectPresent} = require("./repo_utils");

class Mirror {
  constructor(
    id,
    displayName,
    description,
    priceCode,
    discount,
    isNew,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
  }
}

class CreateMirrorRequest {
  constructor(
    displayName,
    description,
    priceCode,
    discount,
    isNew,
    isDeleted,
  ) {
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
  }
}

class CreateMirrorResponse {
  constructor(mirror) {
    this.mirror = mirror;
  }
}

class UpdateMirrorRequest {
  constructor(
    id,
    displayName,
    description,
    priceCode,
    discount,
    isNew,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
  }
}

class UpdateMirrorResponse {
  constructor(mirror) {
    this.mirror = mirror;
  }
}

class GetMirrorByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetMirrorByIdResponse {
  constructor(mirror) {
    this.mirror = mirror;
  }
}

class FindMirrorRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindMirrorResponse {
  constructor(mirrors) {
    this.mirrors = mirrors;
  }
}

class MirrorRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("mirror");
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const data = {
        displayName: req.displayName,
        description: req.description,
        priceCode: req.priceCode,
        discount: req.discount,
        isNew: req.isNew,
        isDeleted: req.isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateMirrorResponse(
        new Mirror(
          id,
          data.displayName,
          data.description,
          data.priceCode,
          data.discount,
          data.isNew,
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

    return new GetMirrorByIdResponse(
      new Mirror(
        doc.id,
        data.displayName,
        data.description,
        data.priceCode,
        data.discount,
        data.isNew,
        data.isDeleted,
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
      result.push(new Mirror(
        doc.id,
        data.displayName,
        data.description,
        data.priceCode,
        data.discount,
        data.isNew,
        data.isDeleted,
      ));
    });

    return new FindMirrorResponse(result);
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
      data.priceCode = selectPresent(req.priceCode, data.priceCode);
      data.isNew = selectPresent(req.isNew, data.isNew);
      data.discount = selectPresent(req.discount, data.discount);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);

      t.update(docRef, data);
      return new UpdateMirrorResponse(
        new Mirror(
          doc.id,
          data.displayName,
          data.description,
          data.priceCode,
          data.discount,
          data.isNew,
          data.isDeleted,
        ),
      );
    });
  }
}

module.exports = {
  CreateMirrorRequest,
  CreateMirrorResponse,
  UpdateMirrorRequest,
  UpdateMirrorResponse,
  GetMirrorByIdRequest,
  GetMirrorByIdResponse,
  FindMirrorRequest,
  FindMirrorResponse,
  MirrorRepo,
};
