import { axiosInstance } from "../lib/utilities";

class BackingService {
  async find({ids, includedDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includedDeleted) {
      params.includeDeleted = true;
    }

    return await axiosInstance.get("backing/", { params }).then(res => res.data.backings);
  }

  async get(id) {
    return await axiosInstance.get(`backing/${id}`).then(res => res.data.backing);
  }

  async update(id, { displayName, description, isNew, priceCode, discount, isDeleted, isDefault }) {
    return await axiosInstance.post(`backing/${id}`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted,
      isDefault
    }).then(res => res.data.backing);
  }

  async create({ displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance.post(`backing/new`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted
    }).then(res => res.data.backing);
  }
}

export default new BackingService();
