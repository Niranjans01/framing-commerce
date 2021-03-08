import { axiosInstance } from '../lib/utilities'

class PricingService {
  async find() {
    return await axiosInstance.get('price-code/').then(res => res.data.priceCodes);
  }
}

export default new PricingService();
