import { axiosInstance } from "../lib/utilities";

class PriceCodeService {
  async find(ids) {
    return await axiosInstance.get("price-code/", {
      params: { ids }
    }).then(res => res.data.priceCodes);
  }

  async get(id) {
    return await axiosInstance.get(`price-code/${id}`).then(res => res.data.priceCode);
  }

  async update(id, { displayName, multiplier, prices }) {
   return await axiosInstance.post(`price-code/${id}`, {
     displayName,
     multiplier,
     prices
   }).then(res => res.data.priceCode);
  }

  async create({ displayName, multiplier, prices }) {
    return await axiosInstance.post(`price-code/new`, {
      displayName,
      multiplier,
      prices
    }).then(res => res.data.priceCode);
  }
}

export default new PriceCodeService();
