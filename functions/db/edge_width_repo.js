const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const { selectPresent } = require("./repo_utils");
const admin = require("firebase-admin");

class EdgeWidth {
  constructor(id, displayName, description, isNew, priceCode, discount, isDeleted) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isDeleted = isDeleted;
  }
}

class CreateEdgeWidthRequest {
  constructor(displayName, description, isNew, priceCode, discount, isDeleted) {
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isDeleted = isDeleted;
  }
}

class CreateEdgeWidthResponse {
  constructor(edgeWidth) {
    this.edgeWidth = edgeWidth;
  }
}

class UpdateEdgeWidthRequest {
  constructor(id, displayName, description, isNew, priceCode, discount, isDeleted) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isDeleted = isDeleted;
  }
}

class UpdateEdgeWidthResponse {
  constructor(edgeWidth) {
    this.edgeWidth = edgeWidth;
  }
}

class GetEdgeWidthByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetEdgeWidthByIdResponse {
  constructor(edgeWidth) {
    this.edgeWidth = edgeWidth;
  }
}

class FindEdgeWidthRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindEdgeWidthResponse {
  constructor(edgeWidths) {
    this.edgeWidths = edgeWidths;
  }
}

class EdgeWidthRepo {
  constructor(firestore) {
    this.db = firestore;
    this.collection = firestore.collection("edgeWidth");
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
        discount: req.discount,
        isDeleted: req.isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateEdgeWidthResponse(
        new EdgeWidth(
          id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.discount,
          data.isDeleted,
        )
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

    return new GetEdgeWidthByIdResponse(
      new EdgeWidth(
        doc.id,
        data.displayName,
        data.description,
        data.isNew,
        data.priceCode,
        data.discount,
        data.isDeleted,
      )
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
      result.push(
        new EdgeWidth(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.discount,
          data.isDeleted,
        )
      );
    });

    return new FindEdgeWidthResponse(result);
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
      data.discount = selectPresent(req.discount, data.discount);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);

      t.update(docRef, data);
      return new UpdateEdgeWidthResponse(
        new EdgeWidth(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.discount,
          data.isDeleted,
        )
      );
    });
  }
}

module.exports = {
  EdgeWidthRepo,
  CreateEdgeWidthRequest,
  CreateEdgeWidthResponse,
  UpdateEdgeWidthRequest,
  UpdateEdgeWidthResponse,
  GetEdgeWidthByIdRequest,
  GetEdgeWidthByIdResponse,
  FindEdgeWidthRequest,
  FindEdgeWidthResponse,
};
