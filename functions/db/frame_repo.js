const { DateTime } = require("luxon");

const shortid = require("shortid");
const {
  NotFoundException,
  BadRequestException,
} = require("../requests/exceptions");

const { FindImageRequest } = require("./image_repo");
const admin = require("firebase-admin");
const {selectPresent} = require("./repo_utils");

class Frame {
  constructor(
    id,
    displayName,
    priceCode,
    horizontalBorderImage,
    verticalBorderImage,
    width,
    height,
    rebate,
    color,
    material,
    createdBy,
    createdOn,
    lastUpdatedBy,
    lastUpdatedOn,
    isDeleted,
    isDefault,
    isOrnate,
    info
  ) {
    this.id = id;
    this.displayName = displayName;
    this.priceCode = priceCode;
    this.horizontalBorderImage = horizontalBorderImage;
    this.verticalBorderImage = verticalBorderImage;
    this.width = width;
    this.height = height;
    this.rebate = rebate;
    this.color = color;
    this.material = material;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.lastUpdatedBy = lastUpdatedBy;
    this.lastUpdatedOn = lastUpdatedOn;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
    this.isOrnate = isOrnate || false
    this.info = info;
  }
}

class CreateFrameRequest {
  constructor(
    displayName,
    priceCode,
    horizontalBorderImage,
    verticalBorderImage,
    width,
    height,
    rebate,
    color,
    material,
    isDeleted,
    isDefault,
    isOrnate,
    info
  ) {
    this.displayName = displayName;
    this.priceCode = priceCode;
    this.horizontalBorderImage = horizontalBorderImage;
    this.verticalBorderImage = verticalBorderImage;
    this.width = width;
    this.height = height;
    this.rebate = rebate;
    this.color = color;
    this.material = material;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false;
    this.isOrnate = isOrnate || false
    this.info = info;
  }
}

class CreateFrameResponse {
  constructor(frame) {
    this.frame = frame;
  }
}

class UpdateFrameRequest {
  constructor(
    id,
    displayName,
    priceCode,
    horizontalBorderImage,
    verticalBorderImage,
    width,
    height,
    rebate,
    color,
    material,
    isDeleted,
    isDefault,
    isOrnate,
    info
  ) {
    this.id = id;
    this.displayName = displayName;
    this.priceCode = priceCode;
    this.horizontalBorderImage = horizontalBorderImage;
    this.verticalBorderImage = verticalBorderImage;
    this.width = width;
    this.height = height;
    this.rebate = rebate;
    this.color = color;
    this.material = material;
    this.isDeleted = isDeleted;
    this.isDefault = isDefault || false
    this.isOrnate = isOrnate || false
    this.info = info;
  }
}

class UpdateFrameResponse {
  constructor(frame) {
    this.frame = frame;
  }
}

class GetFrameByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetFrameByIdResponse {
  constructor(frame) {
    this.frame = frame;
  }
}

class FindFrameRequest {
  constructor(ids, includeDeleted) {
    this.ids = ids;
    this.includeDeleted = includeDeleted;
  }
}

class FindFrameResponse {
  constructor(frames) {
    this.frames = frames;
  }
}

class FrameRepo {
    constructor(db, imageRepo) {
      this.db = db;
      this.collection = db.collection("frames");
      this.imageRepo = imageRepo;
    }

    async create(ctx, req) {
      return await this.db.runTransaction(async (t) => {
        const id = shortid.generate();
        const docRef = this.collection.doc(id);

        const now = DateTime.utc().toMillis();
        const data = {
          displayName: req.displayName,
          priceCode: req.priceCode,
          horizontalBorderImage: req.horizontalBorderImage,
          verticalBorderImage: req.verticalBorderImage,
          width: req.width,
          height: req.height,
          rebate: req.rebate,
          color: req.color,
          material: req.material,
          createdBy: ctx.user.id,
          createdOn: now,
          lastUpdatedOn: now,
          lastUpdatedBy:ctx.user.id,
          isDeleted: req.isDeleted || false,
          isDefault:req.isDefault || false,
          isOrnate:req.isOrnate || false,
          info: req.info
        };

        t.create(docRef, data);

        return new CreateFrameResponse(
          new Frame(
            id,
            data.displayName,
            data.priceCode,
            data.horizontalBorderImage,
            data.verticalBorderImage,
            data.width,
            data.height,
            data.rebate,
            data.color,
            data.material,
            data.createdBy,
            data.createdOn,
            data.lastUpdatedBy,
            data.lastUpdatedOn,
            data.isDeleted,
            data.isDefault,
            data.isOrnate,
            data.info
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

      let horizontalBorderImage = null;
      if (data.horizontalBorderImage) {
        const { images } =  await this.imageRepo.find(new FindImageRequest([data.horizontalBorderImage]))
        horizontalBorderImage = images[0];
      }

      let verticalBorderImage = null;
      if (data.horizontalBorderImage) {
        const { images } =  await this.imageRepo.find(new FindImageRequest([data.verticalBorderImage]))
        verticalBorderImage = images[0];
      }

      return new GetFrameByIdResponse(
        new Frame(
          doc.id,
          data.displayName,
          data.priceCode,
          horizontalBorderImage,
          verticalBorderImage,
          data.width,
          data.height,
          data.rebate,
          data.color,
          data.material,
          data.createdBy,
          data.createdOn,
          data.lastUpdatedBy,
          data.lastUpdatedOn,
          data.isDeleted,
          data.isDefault,
          data.isOrnate,
          data.info
        )
      );
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

      if (!ctx.isAdmin() || !req.includeDeleted) {
        query = query.where("isDeleted", "==", false);
      }

      const snapshot = await query.get();
      const promises = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        promises.push(
          async () => {
            let horizontalBorderImage = null;
            if (data.horizontalBorderImage) {
              const { images } =  await this.imageRepo.find(new FindImageRequest([data.horizontalBorderImage]))
              horizontalBorderImage = images[0];
            }

            let verticalBorderImage = null;
            if (data.horizontalBorderImage) {
              const { images } =  await this.imageRepo.find(new FindImageRequest([data.verticalBorderImage]))
              verticalBorderImage = images[0];
            }

            return new Frame(
              doc.id,
              data.displayName,
              data.priceCode,
              horizontalBorderImage,
              verticalBorderImage,
              data.width,
              data.height,
              data.rebate,
              data.color,
              data.material,
              data.createdBy,
              data.createdOn,
              data.lastUpdatedBy,
              data.lastUpdatedOn,
              data.isDeleted,
              data.isDefault,
              data.isOrnate,
              data.info
            )
          }
        );
      });

      const result = await Promise.all(promises.map(async fn => fn()));

      return new FindFrameResponse(result);
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
        data.priceCode = selectPresent(req.priceCode, data.priceCode);
        data.horizontalBorderImage = selectPresent(req.horizontalBorderImage, data.horizontalBorderImage);
        data.verticalBorderImage = selectPresent(req.verticalBorderImage, data.verticalBorderImage);
        data.width = selectPresent(req.width, data.width);
        data.height = selectPresent(req.height, data.height);
        data.rebate = selectPresent(req.rebate, data.rebate);
        data.color = selectPresent(req.color, data.color);
        data.material = selectPresent(req.material, data.material);
        data.lastUpdatedOn = DateTime.utc().toMillis();
        data.lastUpdatedBy = ctx.user.id;
        data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
        data.isDefault = selectPresent(req.isDefault, data.isDefault);
        data.isOrnate = selectPresent(req.isOrnate, data.isOrnate);
        data.info = selectPresent(req.info, data.info);
        present.forEach(async (e)=>{
          t.update(e.record,e.data)
        })
        t.update(docRef, data);
        let horizontalBorderImage = null;
        if (data.horizontalBorderImage) {
          const { images } =  await this.imageRepo.find(new FindImageRequest([data.horizontalBorderImage]))
          horizontalBorderImage = images[0];
        }

        let verticalBorderImage = null;
        if (data.horizontalBorderImage) {
          const { images } =  await this.imageRepo.find(new FindImageRequest([data.verticalBorderImage]))
          verticalBorderImage = images[0];
        }

        return new UpdateFrameResponse(
          new Frame(
            doc.id,
            data.displayName,
            data.priceCode,
            horizontalBorderImage,
            verticalBorderImage,
            data.width,
            data.height,
            data.rebate,
            data.color,
            data.material,
            data.createdBy,
            data.createdOn,
            data.lastUpdatedBy,
            data.lastUpdatedOn,
            data.isDeleted,
            data.isDefault,
            data.isOrnate,
            data.info
          )
        );
      });
    }
  }

  module.exports = {
    CreateFrameRequest,
    CreateFrameResponse,
    UpdateFrameRequest,
    UpdateFrameResponse,
    GetFrameByIdRequest,
    GetFrameByIdResponse,
    FindFrameRequest,
    FindFrameResponse,
    FrameRepo,
  };
