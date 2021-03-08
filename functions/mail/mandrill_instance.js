const { MailService } = require("./mandrill");

const mailService = new MailService();

module.exports = {
    mailService,
}
