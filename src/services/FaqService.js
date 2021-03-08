import { axiosInstance } from "../lib/utilities";

class FaqService {
  async find({ids}) {
    const params = { ids };
    return await axiosInstance.get("faq/", {
      params
    }).then(res => res.data.faq);
  }

  async get(id) {
    return await axiosInstance.get(`faq/${id}`).then(res => res.data.faq);
  }

  async update(id, { displayName, description, isDeleted}) {
   return await axiosInstance.post(`faq/${id}`, {
     displayName,
     description,
     isDeleted
   }).then(res => res.data.faq);
  }

  async create({ displayName, description, isDeleted }) {
    return await axiosInstance.post(`faq/new`, {
      displayName,
      description,
      isDeleted
    }).then(res => res.data.faq);
  }
}

export default new FaqService();
