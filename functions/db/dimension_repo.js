const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const { selectPresent } = require("./repo_utils");
const admin = require("firebase-admin");

class Dimension {
  constructor(id, displayName, height, width, minimumHeight, minimumWidth,
    maximumHeight, maximumWidth, isCustom, isDeleted, isDefault) {
    this.id = id;
    this.displayName = displayName;
    this.height = height;
    this.width = width;
    this.minimumHeight = minimumHeight;
    this.minimumWidth = minimumWidth;
    this.maximumHeight = maximumHeight;
    this.maximumWidth = maximumWidth;
    this.isCustom = isCustom;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreateDimensionRequest {
  constructor(displayName, height, width, minimumHeight, minimumWidth,
    maximumHeight, maximumWidth, isCustom, isDeleted, isDefault) {
    this.displayName = displayName;
    this.height = height;
    this.width = width;
    this.minimumHeight = minimumHeight;
    this.minimumWidth = minimumWidth;
    this.maximumHeight = maximumHeight;
    this.maximumWidth = maximumWidth;
    this.isCustom = isCustom;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class CreateDimensionResponse {
  constructor(dimension) {
    this.dimension = dimension;
  }
}

class UpdateDimensionRequest {
  constructor(id, displayName, height, width, minimumHeight, minimumWidth,
    maximumHeight, maximumWidth, isCustom, isDeleted, isDefault) {
    this.id = id;
    this.displayName = displayName;
    this.height = height;
    this.width = width;
    this.minimumHeight = minimumHeight;
    this.minimumWidth = minimumWidth;
    this.maximumHeight = maximumHeight;
    this.maximumWidth = maximumWidth;
    this.isCustom = isCustom;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
  }
}

class UpdateDimensionResponse {
  constructor(dimension) {
    this.dimension = dimension;
  }
}

class GetDimensionByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetDimensionByIdResponse {
  constructor(dimension) {
    this.dimension = dimension;
  }
}

class FindDimensionRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindDimensionResponse {
  constructor(dimensions) {
    this.dimensions = dimensions;
  }
}

class DimensionRepo {
  constructor(firestore) {
    this.db = firestore;
    this.collection = firestore.collection("dimension");
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const data = {
        displayName: req.displayName,
        height: req.height,
        width: req.width,
        minimumHeight: req.minimumHeight,
        minimumWidth: req.minimumWidth,
        maximumHeight: req.maximumHeight,
        maximumWidth: req.maximumWidth,
        isCustom: req.isCustom,
        isDeleted: req.isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateDimensionResponse(
        new Dimension(
          id,
          data.displayName,
          data.height,
          data.width,
          data.minimumHeight,
          data.minimumWidth,
          data.maximumHeight,
          data.maximumWidth,
          data.isCustom,
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

    return new GetDimensionByIdResponse(
      new Dimension(
        doc.id,
        data.displayName,
        data.height,
        data.width,
        data.minimumHeight,
        data.minimumWidth,
        data.maximumHeight,
        data.maximumWidth,
        data.isCustom,
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
        new Dimension(
          doc.id,
          data.displayName,
          data.height,
          data.width,
          data.minimumHeight,
          data.minimumWidth,
          data.maximumHeight,
          data.maximumWidth,
          data.isCustom,
          data.isDeleted,
          data.isDefault
        )
      );
    });

    return new FindDimensionResponse(result);
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
      data.height = selectPresent(req.height, data.height);
      data.width = selectPresent(req.width, data.width);
      data.minimumHeight = selectPresent(req.minimumHeight, data.minimumHeight);
      data.minimumWidth = selectPresent(req.minimumWidth, data.minimumWidth);
      data.maximumHeight = selectPresent(req.maximumHeight, data.maximumHeight);
      data.maximumWidth = selectPresent(req.maximumWidth, data.maximumWidth);
      data.isCustom = selectPresent(req.isCustom, data.isCustom);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
      data.isDefault = selectPresent(req.isDefault, data.isDefault);
      
      present.forEach(async (e)=>{
        t.update(e.record,e.data)
      })

      t.update(docRef, data);
      return new UpdateDimensionResponse(
        new Dimension(
          doc.id,
          data.displayName,
          data.height,
          data.width,
          data.minimumHeight,
          data.minimumWidth,
          data.maximumHeight,
          data.maximumWidth,
          data.isCustom,
          data.isDeleted,
          data.isDefault
        )
      );
    });
  }
}

module.exports = {
  DimensionRepo,
  CreateDimensionRequest,
  CreateDimensionResponse,
  UpdateDimensionRequest,
  UpdateDimensionResponse,
  GetDimensionByIdRequest,
  GetDimensionByIdResponse,
  FindDimensionRequest,
  FindDimensionResponse,
};
