const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsApp(to, imageUrl, retry = 1) {
  try {
    console.log(`📤 WhatsApp → ${to}`);

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${to}`,
      mediaUrl: [imageUrl]
    });

    console.log(`✅ WhatsApp sent: ${message.sid}`);
    return message;

  } catch (err) {
    console.error(`❌ WhatsApp failed: ${to}`, err.message);

    if (retry > 0) {
      console.log("🔁 Retrying...");
      return sendWhatsApp(to, imageUrl, retry - 1);
    }

    return null;
  }
}

module.exports = { sendWhatsApp };