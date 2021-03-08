  import { axiosInstance } from '../lib/utilities'

class PortfolioService {
  async getPortfolio() {
    return await axiosInstance.get('portfolios').then(res => res.data['portfolio']);
  }

  async find({ids, includeDeleted}) {
    const params = {};
    if (ids) {
      params.ids = ids;
    }

    if (includeDeleted) {
      params.includeDeleted = true;
    }
    return await axiosInstance.get("portfolio/", { params }).then((res) => res.data.portfolio);
  }

  async get(id) {
    return await axiosInstance.get(`portfolio/${id}`).then((res) => res.data.portfolio);
  }

  async update(id, { displayName, description,category, image, isDeleted}) {
    return await axiosInstance
      .post(`portfolio/${id}`, {
        displayName,
        description,
        category,
        image,
        isDeleted,
      })
      .then((res) => res.data.portfolio);
  }

  async create({ displayName, description,category, image, isDeleted }) {
    return await axiosInstance
      .post(`portfolio/new`, {
        displayName,
        description,
        category,
        image,
        isDeleted,
      })
      .then((res) => res.data.portfolio);
  }
}


export default new PortfolioService();
