const nodemailer = require("nodemailer");
require('dotenv').config();

async function sendMail({from ,to, subject, text, html })
{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 5000,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
 await transporter.sendMail({
    from: `Debut Infotech < ${from} >`,
    to,
    subject,
    text,
    html
})

}



module.exports = sendMail;