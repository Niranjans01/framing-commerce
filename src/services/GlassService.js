import { axiosInstance } from "../lib/utilities";

class GlassService {
  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = includeDeleted;
    }
    return await axiosInstance.get("glass/", { params }).then((res) => res.data.glasses);
  }

  async get(id) {
    return await axiosInstance.get(`glass/${id}`).then((res) => res.data.glass);
  }

  async update(id, { displayName, description, isNew, priceCode, discount, isDeleted,isDefault }) {
    return await axiosInstance
      .post(`glass/${id}`, {
        displayName,
        description,
        isNew,
        priceCode,
        discount,
        isDeleted,
        isDefault
      })
      .then((res) => res.data.glass);
  }

  async create({ displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance
      .post(`glass/new`, {
        displayName,
        description,
        isNew,
        priceCode,
        discount,
        isDeleted,
      })
      .then((res) => res.data.glass);
  }
}

export default new GlassService();
