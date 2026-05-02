const generateImage = require('../utils/imageGenerator');
const { sendWhatsApp } = require('../services/whatsappService');
const { sendEmail } = require('../services/emailService');

exports.sendWish = async (req, res) => {
  try {
    let { name, phone, email, union, type } = req.body;

    // ✅ Basic validation
    if (!name || !phone || !union || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    console.log("TYPE FROM FRONTEND:", req.body.type);
    // ✅ Clean input
    name = String(name).trim();
    phone = String(phone).trim();

    console.log(`📤 Processing ${type} wish for ${name}`);

    // =========================================================
    // ✅ FIX: PHONE NORMALIZATION (CRITICAL)
    // =========================================================
    let cleanPhone = phone.replace(/\D/g, ""); // remove non-digits

    // remove leading 0s
    cleanPhone = cleanPhone.replace(/^0+/, "");

    // add India country code if missing
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    // final WhatsApp format
    const formattedPhone = `whatsapp:+${cleanPhone}`;

    console.log("📱 Final Phone:", formattedPhone);

    // Optional strict validation
    if (cleanPhone.length < 12) {
      console.error("❌ Invalid phone after normalization:", cleanPhone);
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // =========================================================
    // ✅ STEP 1: Generate Image
    // =========================================================
    let imageUrl;
    try {
      imageUrl = await generateImage({ name, union, type, joinDate: req.body.joinDate,  });
      console.log("🖼️ Image URL:", imageUrl);
    } catch (err) {
      console.error("❌ Image Generation Failed:", err);
      return res.status(500).json({ error: "Image generation failed" });
    }

    // =========================================================
    // ✅ STEP 2: Send WhatsApp
    // =========================================================
    let waSuccess = false;

    try {
      await sendWhatsApp(formattedPhone, imageUrl);
      waSuccess = true;
      console.log("✅ WhatsApp sent successfully");
    } catch (err) {
      console.error("❌ WhatsApp Failed:", err.message);
    }

    // =========================================================
    // ✅ STEP 3: Send Email (optional)
    // =========================================================
    let mailSuccess = false;

    if (email) {
      try {
        await sendEmail(email, imageUrl);
        mailSuccess = true;
        console.log("✅ Email sent successfully");
      } catch (err) {
        console.error("❌ Email Failed:", err.message);
      }
    }

    // =========================================================
    // ✅ FINAL RESPONSE
    // =========================================================
    return res.json({
      success: true,
      name,
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