const generateImage = require('../utils/imageGenerator');
const { sendWhatsApp } = require('../services/whatsappService');
const { sendEmail } = require('../services/emailService');

exports.sendWish = async (req, res) => {
  try {
    const { name, phone, email, union, type } = req.body;

    if (!name || !phone || !union || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`📤 Processing ${type} wish for ${name}`);

    const imageUrl = await generateImage({ name, union, type });

    const waRes = await sendWhatsApp(phone, imageUrl);
    const mailRes = email ? await sendEmail(email, imageUrl) : null;

    res.json({
      success: true,
      type,
      imageUrl,
      whatsapp: !!waRes,
      email: !!mailRes
    });

  } catch (e) {
    console.error("❌ Controller Error:", e);
    res.status(500).json({ error: "Failed" });
  }
};