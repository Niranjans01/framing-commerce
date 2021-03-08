const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const { selectPresent } = require("./repo_utils");
const admin = require("firebase-admin");

class Backing {
  constructor(id, displayName, description, isNew, priceCode, discount, isDeleted, isDefault) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreateBackingRequest {
  constructor(displayName, description, isNew, priceCode, discount, isDeleted, isDefault) {
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreateBackingResponse {
  constructor(backing) {
    this.backing = backing;
  }
}

class UpdateBackingRequest {
  constructor(id, displayName, description, isNew, priceCode, discount, isDeleted, isDefault) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class UpdateBackingResponse {
  constructor(backing) {
    this.backing = backing;
  }
}

class GetBackingByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetBackingByIdResponse {
  constructor(backing) {
    this.backing = backing;
  }
}

class FindBackingRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindBackingResponse {
  constructor(backings) {
    this.backings = backings;
  }
}

class BackingRepo {
  constructor(firestore) {
    this.db = firestore;
    this.collection = firestore.collection("backing");
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

      return new CreateBackingResponse(
        new Backing(
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

    return new GetBackingByIdResponse(
      new Backing(
        doc.id,
        data.displayName,
        data.description,
        data.isNew,
        data.priceCode,
        data.discount,
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
        new Backing(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.discount,
          data.isDeleted,
          data.isDefault
        )
      );
    });

    return new FindBackingResponse(result);
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
      data.priceCode = selectPresent(req.priceCode, data.priceCode);
      data.discount = selectPresent(req.discount, data.discount);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
      data.isDefault = selectPresent(req.isDefault, data.isDefault);
      present.forEach(async (e)=>{
        t.update(e.record,e.data)
      })
      t.update(docRef, data);
      return new UpdateBackingResponse(
        new Backing(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.priceCode,
          data.discount,
          data.isDeleted,
          data.isDefault
        )
      );
    });
  }
}

module.exports = {
  BackingRepo,
  CreateBackingRequest,
  CreateBackingResponse,
  UpdateBackingRequest,
  UpdateBackingResponse,
  GetBackingByIdRequest,
  GetBackingByIdResponse,
  FindBackingRequest,
  FindBackingResponse,
};
