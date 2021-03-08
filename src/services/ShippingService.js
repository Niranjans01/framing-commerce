import { axiosInstance } from "../lib/utilities";

class ShippingService {
  async find(ids) {
    return await axiosInstance
      .get("shipping/", {
        params: { ids },
      })
      .then((res) => res.data.shippings);
  }

  async get(id) {
    return await axiosInstance
      .get(`shipping/${id}`)
      .then((res) => res.data.shipping);
  }

  async getByZip(zip) {
    return await axiosInstance
      .get(`shipping/${zip}/zip`)
      .then((res) => res.data.shipping);
  }

  async update(id, { fee, zip }) {
    return await axiosInstance
      .post(`shipping/${id}`, {
        fee,
        zip,
      })
      .then((res) => res.data.shipping);
  }

  async create({ fee, zip }) {
    return await axiosInstance
      .post(`shipping/new`, {
        fee,
        zip,
      })
      .then((res) => res.data.shipping);
  }
}

export default new ShippingService();
