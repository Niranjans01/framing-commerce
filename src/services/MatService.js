import { axiosInstance } from "../lib/utilities";

class MatService {
  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }
    return await axiosInstance.get("mat/", { params }).then((res) => res.data.mats);
  }

  async get(id) {
    return await axiosInstance.get(`mat/${id}`).then((res) => res.data.mat);
  }

  async update(id, { displayName, image, isDeleted}) {
    return await axiosInstance
      .post(`mat/${id}`, {
        displayName,
        image,
        isDeleted,
      })
      .then((res) => res.data.mat);
  }

  async create({ displayName, image, isDeleted }) {
    return await axiosInstance
      .post(`mat/new`, {
        displayName,
        image,
        isDeleted,
      })
      .then((res) => res.data.mat);
  }
}

export default new MatService();
