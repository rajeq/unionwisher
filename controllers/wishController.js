const generateImage = require('../utils/imageGenerator');
const { sendWhatsApp } = require('../services/whatsappService');
const { sendEmail } = require('../services/emailService');

exports.sendWish = async (req, res) => {
  try {
    const { name, phone, email, union, type } = req.body;

    // ✅ Validation
    if (!name || !phone || !union || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`📤 Processing ${type} wish for ${name}`);

    // ✅ STEP 1: Generate Image
    let imageUrl;
    try {
      imageUrl = await generateImage({ name, union, type });
      console.log("🖼️ Image URL:", imageUrl);
    } catch (err) {
      console.error("❌ Image Generation Failed:", err);
      return res.status(500).json({ error: "Image generation failed" });
    }

    // ✅ STEP 2: Format phone ONCE here
    const formattedPhone = `whatsapp:+91${phone}`;

    // ✅ STEP 3: Send WhatsApp
    let waSuccess = false;
    try {
      await sendWhatsApp(formattedPhone, imageUrl);
      waSuccess = true;
      console.log("✅ WhatsApp sent");
    } catch (err) {
      console.error("❌ WhatsApp Failed:", err.message);
    }

    // ✅ STEP 4: Send Email (optional)
    let mailSuccess = false;
    if (email) {
      try {
        await sendEmail(email, imageUrl);
        mailSuccess = true;
        console.log("✅ Email sent");
      } catch (err) {
        console.error("❌ Email Failed:", err.message);
      }
    }

    // ✅ FINAL RESPONSE (never fail completely)
    return res.json({
      success: true,
      type,
      imageUrl,
      whatsapp: waSuccess,
      email: mailSuccess
    });

  } catch (err) {
    console.error("❌ Controller Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};