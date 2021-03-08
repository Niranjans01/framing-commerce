const { getAddressObject } = require("./repo_utils");
const { NotFoundException } = require("../requests/exceptions");
const admin = require("../firebase/admin");

class User {
  constructor(
    id,
    firstName,
    lastName,
    isDeleted,
    shippingAddress,
    phoneNumber,
    isSubscribed,
    isAdmin
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isDeleted = isDeleted;
    this.shippingAddress = getAddressObject(shippingAddress);
    this.phoneNumber = phoneNumber;
    this.isSubscribed = isSubscribed;
    this.isAdmin = isAdmin;
  }
}

class CreateUserRequest {
  constructor(
    id,
    firstName,
    lastName,
    isDeleted,
    shippingAddress,
    phoneNumber,
    isSubscribed,
    isAdmin
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isDeleted = isDeleted;
    this.shippingAddress = getAddressObject(shippingAddress);
    this.phoneNumber = phoneNumber;
    this.isSubscribed = isSubscribed;
    this.isAdmin = isAdmin;
  }
}

class CreateUserResponse {
  constructor(user) {
    this.user = user;
  }
}

class UpdateUserRequest {
  constructor(
    id,
    firstName,
    lastName,
    isDeleted,
    shippingAddress,
    phoneNumber,
    isSubscribed,
    isAdmin
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isDeleted = isDeleted;
    this.shippingAddress = getAddressObject(shippingAddress);
    this.phoneNumber = phoneNumber;
    this.isSubscribed = isSubscribed;
    this.isAdmin = isAdmin;
  }
}

class UpdateUserResponse {
  constructor(user) {
    this.user = user;
  }
}

class GetUserByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class GetUserByIdResponse {
  constructor(user) {
    this.user = user;
  }
}

class DeleteByIdRequest {
  constructor(id) {
    this.id = id;
  }
}

class FindUserRequest {
  constructor() {}
}

class FindUserResponse {
  constructor(users) {
    this.users = users;
  }
}

class UserRepo {
  constructor(firestore) {
    this.db = firestore;
    this.collection = firestore.collection("users");
  }

  async create(req) {
    return await this.db.runTransaction(async (t) => {
      const {
        id,
        firstName = "",
        lastName = "",
        isDeleted = false,
        shippingAddress = [],
        phoneNumber = "",
        isSubscribed = false,
        isAdmin = false,
      } = req;

      const docRef = this.collection.doc(id);
      const data = {
        firstName,
        lastName,
        isDeleted,
        shippingAddress: getAddressObject(shippingAddress),
        phoneNumber,
        isSubscribed,
        isAdmin,
      };
      t.create(docRef, data);

      return new CreateUserResponse(
        new User(
          data.id,
          data.firstName,
          data.lastName,
          data.isDeleted,
          data.shippingAddress,
          data.phoneNumber,
          data.isSubscribed,
          data.isAdmin
        )
      );
    });
  }

  async get(req) {
    const docRef = this.collection.doc(req.id);
    const doc = await docRef.get();
    const data = doc.data();
    if (!data) {
      throw new NotFoundException(`Document with id not found: ${req.id}`);
    }
    return new GetUserByIdResponse(
      new User(
        doc.id,
        data.firstName,
        data.lastName,
        data.isDeleted,
        data.shippingAddress,
        data.phoneNumber,
        data.isSubscribed,
        data.isAdmin
      )
    );
  }

  async find(req) {
    const snapshot = await this.collection.get();
    const result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(
        new User(
          doc.id,
          data.firstName,
          data.lastName,
          data.isDeleted,
          data.shippingAddress,
          data.phoneNumber,
          data.isSubscribed,
          data.isAdmin
        )
      );
    });

    return new FindUserResponse(result);
  }

  async update(req) {
    const docRef = this.collection.doc(req.id);
    return await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      const data = doc.data();
      if (!data) {
        throw new NotFoundException(`Document with id not found: ${req.id}`);
      }
      const {
        firstName = data.firstName,
        lastName = data.lastName,
        isDeleted = data.isDeleted,
        shippingAddress,
        phoneNumber = data.phoneNumber,
        isSubscribed = data.isSubscribed || false,
        isAdmin = data.isAdmin || false,
      } = req;

      const addresses = shippingAddress.length === 0 ? data.shippingAddress : shippingAddress;

      data.firstName = firstName;
      data.lastName = lastName;
      data.isDeleted = isDeleted;
      data.shippingAddress = getAddressObject(addresses);
      data.phoneNumber = phoneNumber;
      data.isSubscribed = isSubscribed;
      data.isAdmin = isAdmin;
      t.update(docRef, data);
      return new UpdateUserResponse(
        new User(
          doc.id,
          data.firstName,
          data.lastName,
          data.isDeleted,
          data.shippingAddress,
          data.phoneNumber,
          data.isSubscribed,
          data.isAdmin
        )
      );
    });
  }

  async delete(req) {
    return this.update({
      id: req.id,
      isDeleted: true,
    });
  }
}

module.exports = {
  UserRepo,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  FindUserRequest,
  FindUserResponse,
  DeleteByIdRequest,
};
