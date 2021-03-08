import { axiosInstance } from "../lib/utilities";

class DimensionService {
  async find({ ids, includeDeleted }) {
    const params = {};

    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }

    return await axiosInstance.get("dimension/", { params }).then(res => res.data.dimensions);
  }

  async get(id) {
    return await axiosInstance.get(`dimension/${id}`).then(res => res.data.dimension);
  }

  async update(id, { displayName, height, width, minimumHeight, minimumWidth,
    maximumHeight, maximumWidth, isCustom, isDeleted, isDefault }) {
    return await axiosInstance.post(`dimension/${id}`, {
      displayName,
      height,
      width,
      minimumHeight,
      minimumWidth,
      maximumHeight,
      maximumWidth,
      isCustom,
      isDeleted,
      isDefault
    }).then(res => res.data.dimension);
  }

  async create({ displayName, height, width, minimumHeight, minimumWidth,
    maximumHeight, maximumWidth, isCustom, isDeleted }) {
    return await axiosInstance.post(`dimension/new`, {
      displayName,
      height,
      width,
      minimumHeight,
      minimumWidth,
      maximumHeight,
      maximumWidth,
      isCustom,
      isDeleted,
    }).then(res => res.data.dimension);
  }
}

export default new DimensionService();
