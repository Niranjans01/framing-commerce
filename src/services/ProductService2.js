import { axiosInstance } from '../lib/utilities'

class ProductService2 {
  async find({category, featured, includeDeleted, skipImageMinting}) {
    const params = {};

    if (category) {
      params.category = category;
    }

    if (featured) {
      params.featured = true;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }

    if (skipImageMinting) {
      params.skipImageMinting = true;
    }

    return await axiosInstance.get("product/", { params }).then(res => res.data.products);
  }

  async get(id, includeConfigurations) {
    const params = {};

    if (includeConfigurations) {
      params.includeConfigurations = true;
    }
    return await axiosInstance.get(`product/${id}`, { params }).then(res => res.data);
  }

  async update(id, {
    displayName,
    discount,
    isNew,
    category,
    tags,
    configurations,
    variants,
    images,
    defaultImg,
    description,
    isFeatured,
    isDeleted,
  }) {
    return await axiosInstance.post(`product/${id}`, {
      displayName,
      discount,
      isNew,
      category,
      tags,
      configurations,
      variants,
      images,
      defaultImg,
      description,
      isFeatured,
      isDeleted,
    }).then(res => res.data.product);
  }

  async applyDiscountToAll(discount) {
    return await axiosInstance.post(`product/applyCommonDiscount`, {
      discount
    }).then(res => res.data);
  }

  async create({
    displayName,
    discount,
    isNew,
    category,
    tags,
    configurations,
    variants,
    images,
    defaultImg,
    description,
    isFeatured,
    isDeleted,
  }) {
    return await axiosInstance.post(`product/new`, {
      displayName,
      discount,
      isNew,
      category,
      tags,
      configurations,
      variants,
      images,
      defaultImg,
      description,
      isFeatured,
      isDeleted,
    }).then(res => res.data.product);
  }
}

export default new ProductService2();
