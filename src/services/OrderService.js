import { axiosInstance } from '../lib/utilities'

class OrderService {
  async get(id) {
    return await axiosInstance.get(`order/${id}`).then(res => res.data.order);
  }

  async update(id, {isShipped, isPaid, trackingNumber, transactionId}) {
    const body = {isShipped, isPaid, trackingNumber, transactionId};
    return await axiosInstance.post(`order/${id}`, body).then(res => res.data.order);
  }

  async find({shipped, paid, start, limit}) {
    const params = {shipped, paid, start, limit};
    return await axiosInstance.get('order/', { params }).then(res => res.data.orders);
  }

  async count({shipped, paid}) {
    const params = {shipped, paid};
    return await axiosInstance.get('order/count', { params }).then(res => res.data.count);
  }

  async placeOrder({items, shippingAddress, billingAddress, deliveryCharges, paymentProvider, couponCode = null}) {

    if(paymentProvider === 'card'){
      paymentProvider = 'eway'
    }

    const body = {
      items,
      shippingAddress,
      billingAddress,
      deliveryCharges,
      paymentProvider,
      couponCode
    }

    return await axiosInstance.post('order/new', body).then(res => res.data);
  }
}

export default new OrderService();
