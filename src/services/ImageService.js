import { axiosInstance } from "../lib/utilities";

class ImageService {
  async get(id) {
    return await axiosInstance.get(`image/${id}`).then(res => res.data);
  }

  async create({ isPrivate, contentType }) {
    return await axiosInstance.post(`image/new`, {
      isPrivate,
      contentType,
    }).then(res => res.data);
  }
}

export default new ImageService();
