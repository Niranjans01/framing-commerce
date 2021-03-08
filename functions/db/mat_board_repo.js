
const shortid = require("shortid");
const {
  NotFoundException,
  BadRequestException,
} = require("../requests/exceptions");
const admin = require("firebase-admin");
const Requests = require("../requests/requests");
const {selectPresent} = require("./repo_utils");
const { FindImageRequest } = require("./image_repo");

const { DateTime } = require("luxon");

class Mat {
  constructor(
    id,
    displayName,
    image,
    createdBy,
    createdOn,
    lastUpdatedBy,
    lastUpdatedOn,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.image = image;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.lastUpdatedBy = lastUpdatedBy;
    this.lastUpdatedOn = lastUpdatedOn;
    this.isDeleted = isDeleted;
  }
}

class CreateMatRequest {
  constructor(displayName, image, isDeleted) {
    this.displayName = displayName;
    this.image = image;
    this.isDeleted = isDeleted;
  }
}

class CreateMatResponse {
  constructor(mat) {
    this.mat = mat;
  }
}

class UpdateMatRequest {
  constructor(id, displayName, image, isDeleted) {
    this.id = id;
    this.displayName = displayName;
    this.image = image;
    this.isDeleted = isDeleted;
  }
}

class UpdateMatResponse {
  constructor(mat) {
    this.mat = mat;
  }
}

class GetMatByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetMatByIdResponse {
  constructor(mat) {
    this.mat = mat;
  }
}

class FindMatRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindMatResponse {
  constructor(mats) {
    this.mats = mats;
  }
}

class MatRepo {
  constructor(db, imageRepo) {
    this.db = db;
    this.collection = db.collection("mat");
    this.imageRepo = imageRepo;
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const now = DateTime.utc().toMillis();

      const data = {
        displayName: req.displayName,
        image: req.image,
        createdBy: ctx.user.id,
        createdOn: now,
        lastUpdatedOn: now,
        lastUpdatedBy: ctx.user.id,
        isDeleted: req.isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateMatResponse(
        new Mat(
          id,
          data.displayName,
          await this._mintImage(ctx, data.image),
          data.createdBy,
          data.createdOn,
          data.lastUpdatedBy,
          data.lastUpdatedOn,
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

    return new GetMatByIdResponse(
      new Mat(
        doc.id,
        data.displayName,
        await this._mintImage(ctx, data.image),
        data.createdBy,
        data.createdOn,
        data.lastUpdatedBy,
        data.lastUpdatedOn,
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
      promises.push(
        async () => {
          return new Mat(
            doc.id,
            data.displayName,
            await this._mintImage(ctx, data.image),
            data.createdBy,
            data.createdOn,
            data.lastUpdatedBy,
            data.lastUpdatedOn,
            data.isDeleted,
          )
        }
      );
    });

    const result = await Promise.all(promises.map(async fn => fn()));

    return new FindMatResponse(result);
  }

  async _mintImage(ctx, image) {
    if (!image) {
      return null;
    }
    const {images} = await this.imageRepo.find(new FindImageRequest([image]))
    return images[0];
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
      data.image = selectPresent(req.image, data.image);
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
      data.lastUpdatedOn = DateTime.utc().toMillis();
      data.lastUpdatedBy = ctx.user.id;

      t.update(docRef, data);
      return new UpdateMatResponse(
        new Mat(
          doc.id,
          data.displayName,
          await this._mintImage(ctx, data.image),
          data.createdBy,
          data.createdOn,
          data.lastUpdatedBy,
          data.lastUpdatedOn,
          data.isDeleted,
        )
      );
    });
  }
}

module.exports = {
  CreateMatRequest,
  CreateMatResponse,
  UpdateMatRequest,
  UpdateMatResponse,
  GetMatByIdRequest,
  GetMatByIdResponse,
  FindMatRequest,
  FindMatResponse,
  MatRepo,
};
