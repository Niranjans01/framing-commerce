import { axiosInstance } from "../lib/utilities";

class StretchingService {
  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = includeDeleted;
    }
    return await axiosInstance.get("stretching/", { params }).then(res => res.data.stretchings);
  }

  async get(id) {
    return await axiosInstance.get(`stretching/${id}`).then(res => res.data.stretching);
  }

  async update(id, { displayName, description, isNew, priceCode, isDeleted }) {
    return await axiosInstance.post(`stretching/${id}`, {
      displayName,
      description,
      isNew,
      priceCode,
      isDeleted,
    }).then(res => res.data.stretching);
  }

  async create({ displayName, description, isNew, priceCode, isDeleted }) {
    return await axiosInstance.post(`stretching/new`, {
      displayName,
      description,
      isNew,
      priceCode,
      isDeleted,
    }).then(res => res.data.stretching);
  }
}

export default new StretchingService();
