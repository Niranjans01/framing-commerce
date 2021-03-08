import { axiosInstance } from "../lib/utilities";

class MirrorService {
  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = includeDeleted;
    }
    return await axiosInstance.get("mirror/", { params }).then(res => res.data.mirrors);
  }

  async get(id) {
    return await axiosInstance.get(`mirror/${id}`).then(res => res.data.mirror);
  }

  async update(id, { displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance.post(`mirror/${id}`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted,
    }).then(res => res.data.mirror);
  }

  async create({ displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance.post(`mirror/new`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted,
    }).then(res => res.data.mirror);
  }
}

export default new MirrorService();
