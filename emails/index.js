const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

exports.sendEmailConfirmation = ({ to, from, subject, text, html }) => {
  mailgun.messages().send({ to, from, subject, text, html }, (error, body) => {
    if (error) {
      console.log(error);
    }
    console.log(body);
  });
};
