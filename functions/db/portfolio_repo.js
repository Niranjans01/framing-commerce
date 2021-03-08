const shortid = require("shortid");
const {
  NotFoundException, BadRequestException
} = require("../requests/exceptions");

const Requests = require("../requests/requests");
const { FindImageRequest } = require("./image_repo");

class Portfolio {
  constructor(
    id,
    displayName,
    description,
    category,
    image,
    createdBy,
    createdOn,
    isDeleted,
    lastUpdatedBy,
    lastUpdatedOn
  ) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.image = image;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.isDeleted = isDeleted;
    this.lastUpdatedBy = lastUpdatedBy;
    this.lastUpdatedOn = lastUpdatedOn;
    this.category = category;
  }
}

class CreatePortfolioRequest {
  constructor(
    displayName,
    description,
    category,
    image,
  ) {
    this.displayName = Requests.checkInstance(displayName, "displayName", "string");
    this.description = Requests.checkInstance(description, "description", "string");
    this.category = Requests.checkInstance(category,"category","string");
    this.image = Requests.checkInstance(image, "image", "string");

  }
}

class CreatePortfolioResponse {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }
}

class UpdatePortfolioRequest {
  constructor(
    id,
    displayName,
    description,
    category,
    image,
    isDeleted,
  ) {
    this.id = Requests.checkInstance(id, "id", "string");
    this.displayName = Requests.checkInstance(displayName, "displayName", "string");
    this.description = Requests.checkInstance(description, "description", "string");
    this.category = Requests.checkInstance(category,"category","string");
    this.image = Requests.checkInstance(image, "image", "string");
    this.isDeleted = Requests.checkInstance(isDeleted, "isDeleted", "boolean");
  }
}

class UpdatePortfolioResponse {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }
}

class GetPortfolioByIdRequest {
  constructor(id) {
    this.id = Requests.checkInstance(id, "id", "string");
  }
}

class GetPortfolioByIdResponse {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }
}

class FindPortfolioRequest {
  constructor() {
  }
}

class FindPortfolioResponse {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }
}

class PortfolioRepo {
  constructor(db, imageRepo) {
    this.db = db;
    this.collection = db.collection("portfolio");
    this.imageRepo = imageRepo;
  }

  async create(ctx, req) {

    return await this.db.runTransaction(async (t) => {

      const id = shortid.generate();
      const docRef = this.collection.doc(id);

      const data = {
        displayName: req.displayName,
        description: req.description,
        category: req.category,
        image: req.image,
        createdBy: ctx.user.id || "",
        createdOn: new Date(),
        lastUpdatedOn: new Date(),
        isDeleted: false,
        lastUpdatedBy: ctx.user.id || "",

      };

      t.create(docRef, data);

      return new CreatePortfolioResponse(
        new Portfolio(
          id,
          data.displayName,
          data.description,
          data.category,
          await this._mintImage(ctx, data.image),
          data.createdBy,
          data.createdOn,
          data.isDeleted,
          data.lastUpdatedBy,
          data.lastUpdatedOn
        ),
      );
    });

  }

  async get(ctx, req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }

    return new GetPortfolioByIdResponse(
      new Portfolio(
        doc.id,
        data.displayName,
        data.description,
        data.category,
        await this._mintImage(ctx, data.image),
        data.createdBy,
        data.createdOn,
        data.isDeleted,
        data.lastUpdatedBy,
        data.lastUpdatedOn
      ),
    );
  }

  async find(ctx, req) {
    const snapshot = await this.collection.get();

    const promises = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      promises.push(
        async () => {
          return new Portfolio(
            doc.id,
            data.displayName,
            data.description,
            data.category,
            await this._mintImage(ctx, data.image),
            data.createdBy,
            data.createdOn,
            data.isDeleted,
            data.lastUpdatedBy,
            data.lastUpdatedOn,
          )
        }
      );
    });

    const result = await Promise.all(promises.map(async fn => fn()));


    return new FindPortfolioResponse(result);
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
      let flag = 0;
      if (req.displayName !== undefined) {
        data.displayName = req.displayName;
        flag = 1;
      }

      if (req.description !== undefined) {
        data.description = req.description;
        flag = 1;
      }
      if (req.category !== undefined) {
        data.category = req.category;
        flag = 1;
      }
      if (req.image !== undefined) {
        data.image = req.image;
        flag = 1;
      }

      if (req.isDeleted !== undefined) {
        data.isDeleted = req.isDeleted;
        flag = 1;
      }
      if (flag === 1) {
        data.lastUpdatedOn = new Date()
        data.lastUpdatedBy = ctx.user.id || "";
      }



      t.update(docRef, data);
      return new UpdatePortfolioResponse(
        new Portfolio(
          doc.id,
          data.displayName,
          data.description,
          data.category,
          await this._mintImage(ctx, data.image),
          data.createdBy,
          data.createdOn,
          data.isDeleted,
          data.lastUpdatedBy,
          data.lastUpdatedOn,
        ),
      );
    });
  }

}


module.exports = {

  CreatePortfolioRequest,
  CreatePortfolioResponse,
  UpdatePortfolioRequest,
  UpdatePortfolioResponse,
  GetPortfolioByIdRequest,
  GetPortfolioByIdResponse,
  FindPortfolioRequest,
  FindPortfolioResponse,
  PortfolioRepo,
};
