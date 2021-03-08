const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const admin = require("firebase-admin");
const Requests = require("../requests/requests");
const {selectPresent} = require("./repo_utils");

class Glass {
  constructor(id, displayName, description, priceCode, discount, isNew, isDeleted, isDefault) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreateGlassRequest {
  constructor(displayName, description, priceCode, discount, isNew, isDeleted, isDefault) {
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.discount = discount;
    this.priceCode = priceCode;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreateGlassResponse {
  constructor(glass) {
    this.glass = glass;
  }
}

class UpdateGlassRequest {
  constructor(id, displayName, description, priceCode, discount, isNew, isDeleted, isDefault) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.discount = discount;
    this.priceCode = priceCode;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class UpdateGlassResponse {
  constructor(glass) {
    this.glass = glass;
  }
}

class GetGlassByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetGlassByIdResponse {
  constructor(glass) {
    this.glass = glass;
  }
}

class FindGlassRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindGlassResponse {
  constructor(glasses) {
    this.glasses = glasses;
  }
}

class GlassRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("glass");
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

      return new CreateGlassResponse(
        new Glass(
          id,
          data.displayName,
          data.description,
          data.priceCode,
          data.discount,
          data.isNew,
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

    return new GetGlassByIdResponse(
      new Glass(
        doc.id,
        data.displayName,
        data.description,
        data.priceCode,
        data.discount,
        data.isNew,
        data.isDeleted,
        data.isDefault
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
        new Glass(
          doc.id,
          data.displayName,
          data.description,
          data.priceCode,
          data.discount,
          data.isNew,
          data.isDeleted,
          data.isDefault
        )
      );
    });

    return new FindGlassResponse(result);
  }

  async update(ctx, req) {
    const docRef = this.collection.doc(req.id);
    const prevDoc = this.collection.where("isDefault","==",true)
    return await this.db.runTransaction(async (t) => {
      const present = []
      if(req.isDefault){
        const doc = await t.get(prevDoc);
        doc.forEach(async (e)=>{
          let data = e.data()
          console.log("Present data:::",data)
          data.isDefault = false
          present.push({record:this.collection.doc(e.id),data})
        })
      }
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }

      data.displayName = selectPresent(req.displayName, data.displayName);
      data.description = selectPresent(req.description, data.description);
      data.isNew = selectPresent(req.isNew, data.isNew);
      data.discount = selectPresent(req.discount, data.discount);
      data.priceCode = selectPresent(req.priceCode, data.priceCode);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
      data.isDefault = selectPresent(req.isDefault, data.isDefault);
      present.forEach(async (e)=>{
        t.update(e.record,e.data)
      })
      t.update(docRef, data);
      return new UpdateGlassResponse(
        new Glass(
          doc.id,
          data.displayName,
          data.description,
          data.priceCode,
          data.discount,
          data.isNew,
          data.isDeleted,
          data.isDefault
        )
      );
    });
  }
}

module.exports = {
  CreateGlassRequest,
  CreateGlassResponse,
  UpdateGlassRequest,
  UpdateGlassResponse,
  GetGlassByIdRequest,
  GetGlassByIdResponse,
  FindGlassRequest,
  FindGlassResponse,
  GlassRepo,
};
