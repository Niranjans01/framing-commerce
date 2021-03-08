const functions = require("../firebase/functions");

const admin = require("../firebase/admin")
const { userRepo } = require("../db/repo_instances");
const { createContact, updateContact } = require("../mail/mail_subscription");
const {
  CreateUserRequest,
  DeleteByIdRequest
} = require("../db/user_repo");

const onUserCreate = functions.auth.user().onCreate(async user => {
  console.log(`Creating user: ${user.uid} ...`);
  await userRepo.create(new CreateUserRequest(
    user.uid,
    user.displayName,
    "",
    false,
    [],
    null,
    false,
    false
  ))
  console.log('Creating mailchimp contact');
  createContact(user.email, 'unsubscribed');
});


const onUserDelete = functions.auth.user().onDelete(async user => {
  console.log(`Deleting user: ${user.uid} ...`);
  await userRepo.delete(new DeleteByIdRequest(user.uid));
});

module.exports = {
  onUserCreate,
  onUserDelete,
}
