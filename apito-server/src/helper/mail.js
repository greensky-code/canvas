const sgMail = require("@sendgrid/mail")
require("dotenv").config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async ({ to, from, fromname, subject, message }) => {
  const mailObject = {
    to,
    from,
    fromname,
    subject,
    html: `<body><p>${message}</p></body>`,
  }

  await sgMail.send(mailObject)
}

module.exports = sendMail