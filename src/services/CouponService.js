import { axiosInstance } from "../lib/utilities";

class CouponService {
  async find({ids}) {
    const params = { ids };
    return await axiosInstance.get("coupon/", {
      params
    }).then(res => res.data.coupons);
  }

  async get(id) {
    return await axiosInstance.get(`coupon/${id}`).then(res => res.data.coupon);
  }

  async update(id, { displayName, description, discount, isDeleted, expiryDate }) {
   return await axiosInstance.post(`coupon/${id}`, {
     displayName,
     description,
     discount,
     isDeleted,
     expiryDate
   }).then(res => res.data.coupon);
  }

  async create({ displayName, description, discount, isDeleted, expiryDate }) {
    return await axiosInstance.post(`coupon/new`, {
      displayName,
      description,
      discount,
      isDeleted,
      expiryDate
    }).then(res => res.data.coupon);
  }
}

export default new CouponService();
