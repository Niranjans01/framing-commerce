var handlebars = require("handlebars");
const admin = require("../firebase/admin");
const functions = require("firebase-functions");
const mandrill = require("mandrill-api/mandrill");
const { userRepo } = require("../db/repo_instances");
const config = functions.config().mandrill;
const mandrill_client = new mandrill.Mandrill(config.key);

class MailService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }
  async arrayFromObject(content) {
    const val = [];
    for (const key in content) {
      val.push({ name: key, content: content[key] });
    }
    return val;
  }

  async sendEmail(emailContent, subject, targetEmailAddress, templateName) {
    const message = {
      subject: subject,
      from_email: "framers@masterframing.com.au",
      from_name: "master framing",
      to: [
        {
          email: targetEmailAddress,
          type: "to",
        },
      ],
      merge_language: "handlebars",
      headers: {
        "Reply-To": "framers@masterframing.com.au",
      },
      global_merge_vars: await this.arrayFromObject(emailContent),
    };

    const template = {
      template_name: templateName,
      template_content: [],
      message: message,
      async: false,
      ip_pool: "Main Pool",
    };

    return mandrill_client.messages.sendTemplate(template);
  }
  async fetchUser(uid) {
    return await admin.auth().getUser(uid);
  }
  async fetchUserDetails(uid) {
    return await userRepo.get(new GetUserByIdRequest(uid));
  }
}

module.exports = {
  MailService,
};
