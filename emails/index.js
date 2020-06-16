const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.userSignupEmail = ({ to, from, subject, text, html }) => {
  sgMail
    .send({ to, from, subject, text, html })
    .then(() => {
      console.log("messsage sent");
    })
    .catch((error) => {
      console.log(error);
    });
};
