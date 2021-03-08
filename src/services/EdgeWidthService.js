import { axiosInstance } from "../lib/utilities";

class EdgeWidthService {
  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }
    return await axiosInstance.get("edge-width/", { params }).then(res => res.data.edgeWidths);
  }

  async get(id) {
    return await axiosInstance.get(`edge-width/${id}`).then(res => res.data.edgeWidth);
  }

  async update(id, { displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance.post(`edge-width/${id}`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted,
    }).then(res => res.data.edgeWidth);
  }

  async create({ displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance.post(`edge-width/new`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted,
    }).then(res => res.data.edgeWidth);
  }
}

export default new EdgeWidthService();
