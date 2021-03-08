import { axiosInstance } from '../lib/utilities'

class ProductService {
  async getProductInfo(name) {
    if (!name) {
      return //must always have name
    }
    return await axiosInstance.get(`products/getProductInfo?name=${name}`).then(res => res.data[0])
  }

  async getProducts(category) {
    let url = 'products/getProductsByCategory'

    if (category) {
      url = `${url}?category=${category}`
    }

    return await axiosInstance.get(url).then(res => res.data)
  }

  async getFeaturedProducts() {
    return await axiosInstance.get('products/getFeaturedProducts').then(res => res.data)
  }

  async updateProduct(id) {
    return await axiosInstance.put(`products/updateProductsInfo/${id}`).then(res => res.data)
  }

  async deleteProduct(id) {
    return await axiosInstance.get(`products/deleteProduct/${id}`).then(res => res.data)
  }

  async createProduct(product) {
    return await axiosInstance.get('products/createProduct').then(res => res.data)
  }
}

export default new ProductService()
