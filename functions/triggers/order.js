const functions = require("../firebase/functions");
const { mailService } = require("../mail/mandrill_instance");
const { GetUserByIdRequest } = require("../db/user_repo");
const { userRepo, imageRepo } = require('../db/repo_instances');
const { getAddressObject } = require("../db/repo_utils");
const { FindImageRequest } = require("../db/image_repo");

async function _fetchUser(uid) {
  if (!uid) {
    return {
      firstName: "Guest"
    };
  }
  console.log(uid)
  return (await userRepo.get(
    // ctx,
    new GetUserByIdRequest(uid),
  )).user;
}

async function _mintImage(image) {
  if (!image) {
    return null;
  }
  const { images } = await imageRepo.find(new FindImageRequest([image]))
  return images[0];
}


const onOrderUpdate = functions.firestore.document('order/{orderId}')
  .onUpdate(async (snap, context) => {
    const newData = snap.after.data();
    const oldData = snap.before.data();
    let email = ''
    let firstName = ''
    if (newData.isPaid !== oldData.isPaid) {
      if (newData.isPaid) {
        mailService.fetchUser(newData.onwer).then(userRecord => {
          email = userRecord.email
          return userRecord
        }).catch(error => {
          email = ''
          return null;
        })
        firstName = (await _fetchUser(newData.owner)).firstName
        shippingDetails = getAddressObject([newData.shippingAddress])

        const emailContent = {
          firstName: firstName,
          invoiceNumber: context.params.orderId,
          order: [],
          deliveryCharges: newData.deliveryCharges,
          shippingAddress: newData.shippingAddress,
          orderDate: newData.orderDate,
          orderTotal: newData.orderTotal,
          trackingNumber: newData.trackingNumber,
          transactionId: newData.transactionId

        }
        let order_total = 0;
        const promises = newData.items.map(async (item) => {
          const orderItem = {}

          orderItem['product'] = item.product
          orderItem['quantity'] = item.quantity
          orderItem['price'] = item.price
          orderItem['total'] = item.quantity * item.price
          orderItem['configurations'] = item.configurations
          orderItem['variant'] = item.variant
          orderItem['image'] = await _mintImage(item.image)

          return orderItem;
        });

        orderItems = await Promise.all(promises)
        emailContent.order = orderItems;
        for (item of orderItems) {
          order_total = order_total + (item.quantity * item.price)
        }
        emailContent['discount'] = (order_total + newData.deliveryCharges) - newData.orderTotal
        if (newData.orderTotal === (order_total + newData.deliveryCharges)) {
          emailContent['appliedCoupon'] = false
        }
        else {
          emailContent['appliedCoupon'] = true
        }
        // await mailService.sendEmail(emailContent, 'Order Confirmed', 'sid@irisind.com', 'orderConfirmation')
        await mailService.sendEmail(emailContent, 'Order Confirmed', 'framers@masterframing.com.au', 'orderConfirmation') //await mailService.sendEmail(emailContent, 'Order Confirmed', email, 'orderConfirmation')
        await mailService.sendEmail(emailContent, 'Order Report', 'framers@masterframing.com.au', 'workOrder')
      }
    }
  });


module.exports = {
  onOrderUpdate
};


