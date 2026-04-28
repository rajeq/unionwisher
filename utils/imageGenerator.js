const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./cloudinary");

// ==============================
// 📦 Upload helper
// ==============================
function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

// ==============================
// 🖼 Templates
// ==============================
const TEMPLATE_MAP = {
  birthday: "templates/birthday.png",
  anniversary: "templates/anniversary.png",
};

// ==============================
// 🎯 SAFE ZONE (BETWEEN TEXT & LOGO)
// ==============================
const SAFE_ZONE = {
  birthday: {
    top: 0.64,     // below wish text
    bottom: 0.75,  // above logo
    maxWidth: 0.65,
    baseFont: 70,
  },
  anniversary: {
    top: 0.57,     // 🔥 slightly lower than text
    bottom: 0.65,  // 🔥 above logo
    maxWidth: 0.35,
    baseFont: 55,
    x: 0.72, 
  },
};

// ==============================
// 🔥 Auto-fit font
// ==============================
function getFontSize(ctx, text, maxWidth, baseSize) {
  let size = baseSize;
  while (size > 20) {
    ctx.font = `bold ${size}px Arial`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }
  return size;
}

// ==============================
// 🎯 MAIN FUNCTION
// ==============================
async function generateImage({ name, type = "birthday" }) {
  try {
    const templatePath = TEMPLATE_MAP[type] || TEMPLATE_MAP.birthday;
    const template = await loadImage(templatePath);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    // draw template
    ctx.drawImage(template, 0, 0);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const zone = SAFE_ZONE[type];

    // center of safe zone
    //const x = canvas.width / 2;
    const x = canvas.width * (zone.x || 0.5);
    const y =
      canvas.height * ((zone.top + zone.bottom) / 2);

    const maxWidth = canvas.width * zone.maxWidth;

    // font fit
    const fontSize = getFontSize(ctx, name, maxWidth, zone.baseFont);
    ctx.font = `bold ${fontSize}px Arial`;

    // style
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 4;

    // draw name
    ctx.fillText(name, x, y, maxWidth);

    ctx.shadowBlur = 0;

    // ==============================
    // ☁️ Upload
    // ==============================
    const buffer = canvas.toBuffer("image/png");

    const result = await uploadBuffer(buffer, {
      folder: "unionwisher",
      public_id: `unionwisher/${name.replace(/\s+/g, "_")}_${Date.now()}`,
    });

    return result.secure_url;
  } catch (err) {
    console.error("Image generation error:", err);
    throw err;
  }
}

module.exports = generateImage;