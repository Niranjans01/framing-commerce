import { axiosInstance } from "../lib/utilities";

class FrameService {
  async find({ ids, includeDeleted }) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }
    return await axiosInstance
      .get("frame/", { params })
      .then((res) => res.data.frames);
  }

  async get(id) {
    return await axiosInstance.get(`frame/${id}`).then((res) => res.data.frame);
  }

  async update(
    id,
    {
      displayName,
      priceCode,
      width,
      height,
      rebate,
      color,
      material,
      image,
      isDeleted,
      isDefault,
      isOrnate,
      horizontalBorderImage,
      verticalBorderImage,
      info
    }
  ) {
    return await axiosInstance
      .post(`frame/${id}`, {
        displayName,
        priceCode,
        width,
        height,
        rebate,
        color,
        material,
        image,
        isDeleted,
        isDefault,
        isOrnate,
        horizontalBorderImage,
        verticalBorderImage,
        info
      })
      .then((res) => res.data.frame);
  }

  async create({
    displayName,
    priceCode,
    width,
    height,
    rebate,
    color,
    material,
    image,
    isDeleted,
    horizontalBorderImage,
    verticalBorderImage,
    info
  }) {
    return await axiosInstance
      .post(`frame/new`, {
        displayName,
        priceCode,
        width,
        height,
        rebate,
        color,
        material,
        image,
        isDeleted,
        horizontalBorderImage,
        verticalBorderImage,
        info
      })
      .then((res) => res.data.frame);
  }
}

export default new FrameService();
