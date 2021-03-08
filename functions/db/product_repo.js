const admin = require("firebase-admin");

const shortid = require("shortid");
const { NotFoundException } = require("../requests/exceptions");
const { selectPresent } = require("./repo_utils");
const { DateTime } = require("luxon");

const { GetUserByIdRequest } = require("./user_repo");

const { FindBackingRequest } = require("./backing_repo");
const { FindDimensionRequest } = require("./dimension_repo");
const { FindEdgeRequest } = require("./edge_repo");
const { FindEdgeWidthRequest } = require("./edge_width_repo");
const { FindFrameRequest } = require("./frame_repo");
const { FindGlassRequest } = require("./glass_repo");
const { FindMatRequest } = require("./mat_board_repo");
const { FindMirrorRequest } = require("./mirror_repo");
const { FindPrintRequest } = require("./print_repo");
const { FindStretchingRequest } = require("./stretching_repo");
const { FindImageRequest } = require("./image_repo");

class Product {
  constructor(
    id,
    displayName,
    discount,
    isNew,
    category,
    tags,
    configurations,
    variants,
    images,
    defaultImg,
    description,
    isFeatured,
    createdBy,
    createdOn,
    lastUpdatedBy,
    lastUpdatedOn,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.discount = discount;
    this.isNew = isNew;
    this.category = category;
    this.tags = tags;
    this.configurations = configurations;
    this.variants = variants;
    this.images = images;
    this.defaultImg = defaultImg;
    this.description = description;
    this.isFeatured = isFeatured;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.lastUpdatedBy = lastUpdatedBy;
    this.lastUpdatedOn = lastUpdatedOn;
    this.isDeleted = isDeleted;
  }
}

class CreateProductRequest {
  constructor(
    displayName,
    discount,
    isNew,
    category,
    tags,
    configurations,
    variants,
    images,
    defaultImg,
    description,
    isFeatured,
    isDeleted,
  ) {
    this.displayName = displayName;
    this.discount = discount;
    this.isNew = isNew;
    this.category = category;
    this.tags = tags;
    this.configurations = configurations;
    this.variants = variants;
    this.images = images;
    this.defaultImg = defaultImg;
    this.description = description;
    this.isFeatured = isFeatured;
    this.isDeleted = isDeleted;
  }
}

class CreateProductResponse {
  constructor(product) {
    this.product = product;
  }
}

class UpdateProductRequest {
  constructor(
    id,
    displayName,
    discount,
    isNew,
    category,
    tags,
    configurations,
    variants,
    images,
    defaultImg,
    description,
    isFeatured,
    isDeleted,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.discount = discount;
    this.isNew = isNew;
    this.category = category;
    this.tags = tags;
    this.configurations = configurations;
    this.variants = variants;
    this.images = images;
    this.defaultImg = defaultImg;
    this.description = description;
    this.isFeatured = isFeatured;
    this.isDeleted = isDeleted;
  }
}

class GetProductByIdRequest {
  constructor(id, includeConfigurations) {
    this.id = id;
    this.includeConfigurations = includeConfigurations;
  }
}

class ApplyDiscountResponse {
  constructor(discount){
    this.discount = discount
  }
}

class GetProductByIdResponse {
  constructor(product, configurations) {
    this.product = product;
    this.configurations = configurations;
  }
}

class FindProductRequest {
  constructor(category, featured, includeDeleted, displayName, skipImageMinting) {
    this.category = category;
    this.featured = featured;
    this.includeDeleted = includeDeleted;
    this.displayName = displayName;
    this.skipImageMinting = skipImageMinting;
  }
}

class FindProductResponse {
  constructor(products) {
    this.products = products;
  }
}


class UpdateProductResponse {
  constructor(product) {
    this.product = product;
  }
}

class ApplyDiscountRequest {
  constructor(discount) {
    this.discount = discount;
  }
}

class ProductRepo {
  constructor(db, userRepo, backingRepo, dimensionRepo, edgeRepo, edgeWidthRepo,
    frameRepo, glassRepo, matRepo, mirrorRepo, printRepo, stretchingRepo, imageRepo) {
    this.db = db;
    this.collection = this.db.collection("product");
    this.userRepo = userRepo;
    this.backingRepo = backingRepo;
    this.dimensionRepo = dimensionRepo;
    this.edgeRepo = edgeRepo;
    this.edgeWidthRepo = edgeWidthRepo;
    this.frameRepo = frameRepo;
    this.glassRepo = glassRepo;
    this.matRepo = matRepo;
    this.mirrorRepo = mirrorRepo;
    this.printRepo = printRepo;
    this.stretchingRepo = stretchingRepo;
    this.imageRepo = imageRepo;
    this.userCache = {};
  }

  async create(ctx, req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const {
        displayName,
        discount,
        isNew,
        category,
        tags,
        configurations,
        variants,
        images,
        defaultImg,
        description,
        isFeatured,
        isDeleted,
      } = req;

      const now = DateTime.utc().toMillis();
      const uid =  ctx ? ctx.user.id : null
      const data = {
        displayName,
        discount,
        isNew,
        category,
        tags,
        configurations,
        variants,
        images,
        defaultImg,
        description,
        isFeatured,
        createdBy: uid,
        createdOn: now,
        lastUpdatedBy: uid,
        lastUpdatedOn: now,
        isDeleted: isDeleted || false,
      };

      t.create(docRef, data);

      return new CreateProductResponse(
        new Product(
          id,
          displayName,
          discount,
          isNew,
          category,
          tags,
          configurations,
          variants,
          (await this.imageRepo.find(new FindImageRequest(images))).images,
          description,
          isFeatured,
          this._fetchUser(ctx, data.createdBy),
          data.createdOn,
          this._fetchUser(ctx, data.lastUpdatedBy),
          data.lastUpdatedOn,
          data.isDeleted,
        ),
      );
    });
  }

  async update(ctx, req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }
      console.log(`Loaded id: ${doc.id} with data`, data);

      data.displayName = selectPresent(req.displayName, data.displayName);
      data.discount = selectPresent(req.discount, data.discount);
      data.isNew = selectPresent(req.isNew, data.isNew);
      data.category = selectPresent(req.category, data.category);
      data.tags = selectPresent(req.tags, data.tags);
      data.configurations = selectPresent(req.configurations, data.configurations);
      data.variants = selectPresent(req.variants, data.variants);
      data.images = selectPresent(req.images, data.images);
      data.defaultImg = req.defaultImg?req.defaultImg:null;
      data.description = selectPresent(req.description, data.description);
      data.lastUpdatedBy = ctx.user.id;
      data.lastUpdatedOn = DateTime.utc().toMillis();
      data.isDeleted = selectPresent(req.isDeleted, data.isDeleted);
      data.isFeatured = selectPresent(req.isFeatured, data.isFeatured);

      console.log(`Updating id: ${doc.id} with data`, data);

      t.update(docRef, data);

      const images = [];

      const imagesLoop = Math.ceil(data.images.length / 10);

      for (let i = 0; i < imagesLoop; i++) {
        let imgs = data.images.slice(i * 10, (i + 1) * 10);
        const imgUrls = await this.imageRepo.find(new FindImageRequest(imgs));
        images.push(imgUrls);
      }

      return new UpdateProductResponse(
        new Product(
          doc.id,
          data.displayName,
          data.discount,
          data.isNew,
          data.category,
          data.tags,
          data.configurations,
          data.variants,
          images.images,
          data.defaultImg,
          data.description,
          data.isFeatured,
          await this._fetchUser(ctx.uid, data.createdBy),
          data.createdOn,
          await this._fetchUser(ctx, data.lastUpdatedBy),
          data.lastUpdatedOn,
          data.isDeleted,
        ),
      );
    });
  }

  async applyDiscount(ctx,req) {
      const apply = await this.collection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.update({
                discount:req.discount
            });
        });
        return querySnapshot
    });
    return new ApplyDiscountResponse(req);
  }

  async get(ctx, req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data || (data.isDeleted && !ctx.isAdmin())) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }

    return new GetProductByIdResponse(
      new Product(
        doc.id,
        data.displayName,
        data.discount,
        data.isNew,
        data.category,
        data.tags,
        data.configurations,
        data.variants,
        (await this.imageRepo.find(new FindImageRequest(data.images))).images,
        data.defaultImg,
        data.description,
        data.isFeatured,
        await this._fetchUser(ctx, data.createdBy),
        data.createdOn,
        await this._fetchUser(ctx, data.lastUpdatedBy),
        data.lastUpdatedOn,
        data.isDeleted,
      ),
      req.includeConfigurations ? await this._fetchConfigurations(ctx, data.configurations) : null,
    );
  }

  async find(ctx, req) {
    let query = this.collection;

    if (req.category) {
      query = query.where("category", "==", req.category);
    }

    if (req.featured) {
      query = query.where("isFeatured", "==", true);
    }

    if (!ctx.isAdmin() || !req.includeDeleted) {
      query = query.where("isDeleted", "==", false);
    }

    if (req.displayName) {
      query = query.where("displayName", "==", req.displayName);
    }

    const snapshot = await query.get();
    let result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(
        async () => {
          return new Product(
            doc.id,
            data.displayName,
            data.discount,
            data.isNew,
            data.category,
            data.tags,
            data.configurations,
            data.variants,
            req.skipImageMinting ? [] : (await this.imageRepo.find(new FindImageRequest(data.images))).images,
            req.skipImageMinting ? [] : data.defaultImg,
            data.description,
            data.isFeatured,
            await this._fetchUser(ctx, data.createdBy),
            data.createdOn,
            await this._fetchUser(ctx, data.lastUpdatedBy),
            data.lastUpdatedOn,
            data.isDeleted,
          );
        }
      );
    });

    return new FindProductResponse(await Promise.all(result.map(fn => fn())));
  }

  async _fetchUser(ctx, uid) {
    if (!uid) {
      return {
        firstName: "Guest"
      };
    }

    const cachedUser = this.userCache[uid];

    if (cachedUser) {
      return cachedUser;
    }

    const {user} = await this.userRepo.get(
      // ctx,
      new GetUserByIdRequest(uid),
    );

    if (user) {
      this.userCache[uid] = user;
    }

    return user;
  }


  async _fetchConfigurations(ctx, configurations) {
    const result = {};
    const promises = configurations.map(async (configuration) => {

      const queries = []
      const values = configuration.values || [];
      let i, j, chunk = 10;
      for (i = 0, j = values.length; i < j; i += chunk) {
        queries.push(values.slice(i, i + chunk));
      }
      result[configuration.name] = [];

      // hack, if configuration.values is empty we want to query everything.
      if (queries.length === 0) {
        queries.push([]);
      }

      const t = queries.map(async query => {
        switch (configuration.name) {
          case "backing":
            return (await this.backingRepo.find(ctx, new FindBackingRequest(query))).backings;
          case "dimension":
            return (await this.dimensionRepo.find(ctx, new FindDimensionRequest(query))).dimensions;
          case "edge":
            return (await this.edgeRepo.find(ctx, new FindEdgeRequest(query))).edges;
          case "edge_width":
            return (await this.edgeWidthRepo.find(ctx, new FindEdgeWidthRequest(query))).edgeWidths;
          case "frame":
            return (await this.frameRepo.find(ctx, new FindFrameRequest(query))).frames;
          case "glass":
            return (await this.glassRepo.find(ctx, new FindGlassRequest(query))).glasses;
          case "image":
            return [];
          case "mat":
            return (await this.matRepo.find(ctx, new FindMatRequest(query))).mats;
          case "mirror":
            return (await this.mirrorRepo.find(ctx, new FindMirrorRequest(query))).mirrors;
          case "print":
            return (await this.printRepo.find(ctx, new FindPrintRequest(query))).prints;
          case "stretching":
            return (await this.stretchingRepo.find(ctx, new FindStretchingRequest(query))).stretchings;
          default:
            throw new Error(`Unsupported configuration: ${configuration}`);
        }
      });

      result[configuration.name] = (await Promise.all(t)).flat();
    });

    await Promise.all(promises);
    return result;
  }
}

module.exports = {
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  GetProductByIdRequest,
  GetProductByIdResponse,
  ApplyDiscountResponse,
  ApplyDiscountRequest,
  FindProductRequest,
  FindProductResponse,
  ProductRepo,
}
