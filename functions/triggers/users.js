const functions = require("../firebase/functions");

const admin = require("../firebase/admin")
const { updateContact } = require("../mail/mail_subscription");


const onUsersUpdate = functions.firestore.document('users/{userId}')
  .onUpdate(async (snap, context) => {
    const newData = snap.after.data();
    const oldData = snap.before.data();
    mailid = (await admin.auth().getUser(context.params.userId)).email
    if (newData.isSubscribed !== oldData.isSubscribed) {
      if (newData.isSubscribed) {
        updateContact(mailid, 'subscribed');
      }
      else {
        updateContact(mailid, 'unsubscribed');
      }
    }
  });


module.exports = {
  onUsersUpdate
}
