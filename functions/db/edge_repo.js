const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const admin = require("firebase-admin");
const {selectPresent} = require("./repo_utils");
const { FindImageRequest } = require("./image_repo");

class Edge {
  constructor(
    id,
    displayName,
    description,
    isNew,
    discount,
    images,
    priceCode,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.isNew = isNew;
    this.discount = discount;
    this.images = images;
    this.priceCode = priceCode;
    this.isDeleted = isDeleted;
  }
}

class CreateEdgeRequest {
  constructor(displayName, description, isNew, discount, images, priceCode, isDeleted) {
    this.displayName = displayName;
    this.description = description;
    this.discount = discount;
    this.isNew = isNew;
    this.images = images;
    this.priceCode = priceCode;
    this.isDeleted = isDeleted;
  }
}

class CreateEdgeResponse {
  constructor(edge) {
    this.edge = edge;
  }
}

class UpdateEdgeRequest {
  constructor(
    id,
    displayName,
    description,
    isNew,
    discount,
    images,
    priceCode,
    isDeleted
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.discount = discount;
    this.isNew = isNew;
    this.images = images;
    this.priceCode = priceCode;
    this.isDeleted = isDeleted;
  }
}

class UpdateEdgeResponse {
  constructor(edge) {
    this.edge = edge;
  }
}

class GetEdgeByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetEdgeByIdResponse {
  constructor(edge) {
    this.edge = edge;
  }
}

class FindEdgeRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindEdgeResponse {
  constructor(edges) {
    this.edges = edges;
  }
}

class EdgeRepo {
  constructor(firestore, imageRepo) {
    this.db = firestore;
    this.imageRepo = imageRepo;
    this.collection = firestore.collection("edge");
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const data = {
        displayName: req.displayName,
        description: req.description,
        isNew: req.isNew,
        discount: req.discount,
        images: req.images,
        priceCode: req.priceCode,
        isDeleted: req.isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateEdgeResponse(
        new Edge(
          id,
          data.displayName,
          data.description,
          data.isNew,
          data.discount,
          data.images,
          data.priceCode,
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
    const mintedImages = (await this.imageRepo.find(new FindImageRequest(data.images))).images;

    return new GetEdgeByIdResponse(
      new Edge(
        doc.id,
        data.displayName,
        data.description,
        data.isNew,
        data.discount,
        mintedImages,
        data.priceCode,
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
    const promises = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      promises.push(async () => {
        return new Edge(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.discount,
          (await this.imageRepo.find(new FindImageRequest(data.images))).images,
          data.priceCode,
          data.isDeleted,
        );
      });
    });

    const result = await Promise.all(promises.map(fn => fn()));

    return new FindEdgeResponse(result);
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
      data.discount = selectPresent(req.discount, data.discount);
      data.images = selectPresent(req.images, data.images);
      data.priceCode = selectPresent(req.priceCode, data.priceCode);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);

      t.update(docRef, data);
      return new UpdateEdgeResponse(
        new Edge(
          doc.id,
          data.displayName,
          data.description,
          data.isNew,
          data.discount,
          (await this.imageRepo.find(new FindImageRequest(data.images))).images,
          data.priceCode,
          data.isDeleted,
        )
      );
    });
  }
}

module.exports = {
  EdgeRepo,
  CreateEdgeRequest,
  CreateEdgeResponse,
  UpdateEdgeRequest,
  UpdateEdgeResponse,
  GetEdgeByIdRequest,
  GetEdgeByIdResponse,
  FindEdgeRequest,
  FindEdgeResponse,
};
