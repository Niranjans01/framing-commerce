const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const { BadRequestException } = require("../../requests/exceptions");

const { mailService } = require("../../mail/mandrill_instance");

router.post(
  "/",
  wrap(async (req) => {
    const body = req.body;
    const Content = {
      firstName: body.firstName,
      subject: body.subject,
      email: body.email,
      message: body.message,
    };
    await mailService
      .sendEmail(
        Content,
        "MasterFraming will get back Shortly",
        body.email,
        "contactUsReply"
      )
      .catch((error) => {
        throw new BadRequestException(
          `Unable to contact user with : ${body.email}`
        );
      });
    await mailService
      .sendEmail(
        Content,
        "Query from Customer",
        "framers@masterframing.com.au",
        "contactUs"
      )
      .catch((error) => {
        throw new BadRequestException(`Unable to reach Masterframing email`);
      });
    return { status: "mail Sent" };
  })
);

module.exports = router;
