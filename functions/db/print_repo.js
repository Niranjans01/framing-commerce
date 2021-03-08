const shortid = require("shortid");
const {
  NotFoundException
} = require("../requests/exceptions");
const admin = require("firebase-admin");
const Requests = require("../requests/requests");
const {selectPresent} = require("./repo_utils");


class Print {
  constructor(
    id,
    displayName,
    description,
    priceCode,
    discount,
    isNew,
    isDeleted,
    isDefault
  ) {
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

class CreatePrintRequest {
  constructor(
    displayName,
    description,
    priceCode,
    discount,
    isNew,
    isDeleted,
    isDefault
  ) {
    this.displayName = displayName;
    this.description = description;
    this.priceCode = priceCode;
    this.discount = discount;
    this.isNew = isNew;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreatePrintResponse {
  constructor(print) {
    this.print = print;
  }
}

class UpdatePrintRequest {
  constructor(
    id,
    displayName,
    description,
    priceCode,
    discount,
    isNew,
    isDeleted,
    isDefault
  ) {
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

class UpdatePrintResponse {
  constructor(print) {
    this.print = print;
  }
}

class GetPrintByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetPrintByIdResponse {
  constructor(print) {
    this.print = print;
  }
}

class FindPrintRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindPrintResponse {
  constructor(prints) {
    this.prints = prints;
  }
}

class PrintRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("print");
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

      return new CreatePrintResponse(
        new Print(
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

    return new GetPrintByIdResponse(
      new Print(
        doc.id,
        data.displayName,
        data.description,
        data.priceCode,
        data.discount,
        data.isNew,
        data.isDeleted,
        data.isDefault
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
      result.push(new Print(
        doc.id,
        data.displayName,
        data.description,
        data.priceCode,
        data.discount,
        data.isNew,
        data.isDeleted,
        data.isDefault
      ));
    });

    return new FindPrintResponse(result);
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
      data.priceCode = selectPresent(req.priceCode, data.priceCode);
      data.isNew = selectPresent(req.isNew, data.isNew);
      data.discount = selectPresent(req.discount, data.discount);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
      data.isDefault = selectPresent(req.isDefault, data.isDefault);
      present.forEach(async (e)=>{
        t.update(e.record,e.data)
      })
      t.update(docRef, data);
      return new UpdatePrintResponse(
        new Print(
          doc.id,
          data.displayName,
          data.description,
          data.priceCode,
          data.discount,
          data.isNew,
          data.isDeleted,
          data.isDefault
        ),
      );
    });
  }
}

module.exports = {
  CreatePrintRequest,
  CreatePrintResponse,
  UpdatePrintRequest,
  UpdatePrintResponse,
  GetPrintByIdRequest,
  GetPrintByIdResponse,
  FindPrintRequest,
  FindPrintResponse,
  PrintRepo,
};
