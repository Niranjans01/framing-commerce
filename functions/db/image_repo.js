const shortid = require("shortid");
const {
  NotFoundException
} = require("../requests/exceptions");

const Requests = require("../requests/requests");
const { Storage } = require('@google-cloud/storage');
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const { DateTime } = require("luxon");


class Image {
  constructor(
    id,
    isPrivate,
    key,
    contentType,
  ) {
    this.id = id;
    this.isPrivate = isPrivate;
    this.key = key;
    this.contentType = contentType;
  }
}

class CreateImageRequest {
  constructor(isPrivate, contentType) {
    this.isPrivate = Requests.checkInstance(isPrivate, "isPrivate", "boolean");
    this.contentType = Requests.checkInstance(contentType, "extension", "string");
  }
}

class CreateImageResponse {
  constructor(id, uploadUrl) {
    this.id = id;
    this.uploadUrl = uploadUrl;
  }
}

class GetImageByIdRequest {
  constructor(id) {
    this.id =  Requests.checkInstance(id, "id", "string");
  }
}

class GetImageByIdResponse {
  constructor(id, url) {
    this.id = id;
    this.url = url;
  }
}

class FindImageRequest {
  constructor(ids) {
    this.ids = ids;
  }
}

class FindImageResponse {
  constructor(images) {
    this.images = images;
  }
}

class DeleteImageByIdRequest {
  constructor(id) {
    this.id =  Requests.checkInstance(id, "id", "string");
  }
}

class DeleteImageByIdResponse {
  constructor() {
  }
}

class ImageRepo {
  constructor(db) {
    this.db = db;
    this.collection = db.collection("image");
    this.storage = new Storage();
    this.buckets = {
      true: functions.config().bucket.private,
      false: functions.config().bucket.public,
    };
  }

  async create(req) {
    return await this.db.runTransaction(async (t) => {
      const id = shortid.generate();
      const docRef = this.collection.doc(id);
      const key = `${id}.${req.contentType.split("/")[1]}`;
      const isPrivate = req.isPrivate;
      const data = {
        isPrivate,
        key,
      };

      t.create(docRef, data);

      const options = {
        version: "v4",
        action: "write",
        expires: Date.now() + 60 * 60 * 1000, // 1hr
        contentType: req.contentType,
      };

      const bucket = this.buckets[isPrivate];
      console.log(`Minting url for bucket: ${bucket}`);
      // Get a v4 signed URL for uploading file
      const [url] = await this.storage
        .bucket(bucket)
        .file(key)
        .getSignedUrl(options);

      return new CreateImageResponse(id, url);
    });
  }

  async mintUrl(isPrivate, key) {
    const bucket = this.buckets[isPrivate];
    let url;
    if (!isPrivate) {
      url = `https://storage.googleapis.com/${bucket}/${key}`;
    } else {
      const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + 120 * 60 * 1000, // 2hrs
      };

      // Get a v4 signed URL for uploading file
      const [mintedUrl] = await this.storage
        .bucket(bucket)
        .file(key)
        .getSignedUrl(options);
      url = mintedUrl;
    }
    return url;
  }

  async find(req) {
    let query = this.collection;

    if (!(req.ids && req.ids.length > 0)) {
      return new FindImageResponse([]);
    }

    const promises = [];

    const imagesLoop = Math.ceil(req.ids.length / 10);

    for (let i = 0; i < imagesLoop; i++) {
      let query = this.collection;
      let imgs = req.ids.slice(i * 10, (i + 1) * 10);

      query = query.where(admin.firestore.FieldPath.documentId(), "in", imgs);

      const snapshot = await query.get();
      snapshot.forEach((doc) => {
        const data = doc.data();
        promises.push(async () => {
          return {
            id: doc.id,
            url: await this.mintUrl(data.isPrivate, data.key),
          };
        });
      });
    }

    const result = await Promise.all(promises.map((fn) => fn()));

    const sorted = result.sort(
      (a, b) =>
      req.ids.indexOf(a.id) -
      req.ids.indexOf(b.id)
    )

    return new FindImageResponse(sorted);
  }

  async get(req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }

    return new GetImageByIdResponse(
      doc.id,
      await this.mintUrl(data.isPrivate, data.key)
    );
  }

  async delete(req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      const bucket = this.buckets[data.isPrivate];
      const key = data.key;

      console.log(DateTime.utc().toISO());
      const [metadata] = await this.storage
        .bucket(bucket)
        .file(key)
        .setMetadata({
          customTime: DateTime.utc().toISO(),
        });

      await t.delete(docRef);

      return new DeleteImageByIdResponse();
    });
  }
}

module.exports = {
  CreateImageRequest,
  CreateImageResponse,
  GetImageByIdRequest,
  GetImageByIdResponse,
  FindImageRequest,
  FindImageResponse,
  DeleteImageByIdRequest,
  DeleteImageByIdResponse,
  ImageRepo
};
