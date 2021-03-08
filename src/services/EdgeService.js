import { axiosInstance } from "../lib/utilities";

class EdgeService {
  async find({ids, includeDeleted}) {
    const params = {};

    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }
    return await axiosInstance.get("edge/", { params }).then(res => res.data.edges);
  }

  async get(id) {
    return await axiosInstance.get(`edge/${id}`).then(res => res.data.edge);
  }

  async update(id, { displayName, description, isNew, priceCode, discount, images, isDeleted }) {
    return await axiosInstance.post(`edge/${id}`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      images,
      isDeleted,
    }).then(res => res.data.edge);
  }

  async create({ displayName, description, isNew, priceCode, discount, images, isDeleted }) {
    return await axiosInstance.post(`edge/new`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      images,
      isDeleted,
    }).then(res => res.data.edge);
  }
}

export default new EdgeService();
