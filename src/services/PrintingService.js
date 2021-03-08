import { axiosInstance } from "../lib/utilities";

class PrintingService {
  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = includeDeleted;
    }
    return await axiosInstance.get("print/", { params }).then(res => res.data.prints);
  }

  async get(id) {
    return await axiosInstance.get(`print/${id}`).then(res => res.data.print);
  }

  async update(id, { displayName, description, isNew, priceCode, discount, isDeleted, isDefault }) {
    return await axiosInstance.post(`print/${id}`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted,
      isDefault
    }).then(res => res.data.print);
  }

  async create({ displayName, description, isNew, priceCode, discount, isDeleted }) {
    return await axiosInstance.post(`print/new`, {
      displayName,
      description,
      isNew,
      priceCode,
      discount,
      isDeleted
    }).then(res => res.data.print);
  }
}

export default new PrintingService();
