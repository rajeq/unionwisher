const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, imagePath, retry = 1) {
  try {
    console.log(`📧 Email → ${to}`);

    const res = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Greetings 🎉',
      html: `<img src="cid:image"/>`,
      attachments: [{
        filename: 'wish.png',
        path: imagePath,
        cid: 'image'
      }]
    });

    console.log(`✅ Email sent`);
    return res;

  } catch (err) {
    console.error(`❌ Email failed: ${to}`, err.message);

    if (retry > 0) {
      console.log("🔁 Retrying email...");
      return sendEmail(to, imagePath, retry - 1);
    }

    return null;
  }
}

module.exports = { sendEmail };