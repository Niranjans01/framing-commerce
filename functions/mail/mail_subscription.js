var Mailchimp = require('mailchimp-api-v3');
const functions = require("firebase-functions");
const config = functions.config().mailchimp;
var mailchimp = new Mailchimp(config.key);
const md5 = require('md5')


async function createContact(emailAddress, subscription, firstName = '', lastName = '') {
  return mailchimp.post('/lists/' + config.list + '/members/', {
    merge_fields: {
      "FNAME": firstName,
      "LNAME": lastName
    },
    email_address: emailAddress,
    status_if_new: subscription,
    status: subscription
  })
}

async function updateContact(emailAddress, subscription, firstName = '', lastName = '') {
  return mailchimp.put('/lists/' + config.list + '/members/' + md5(emailAddress), {
    merge_fields: {
      "FNAME": firstName,
      "LNAME": lastName
    },
    email_address: emailAddress,
    status_if_new: subscription,
    status: subscription
  })
}

module.exports = {
  createContact,
  updateContact
}
