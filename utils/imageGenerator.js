const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./cloudinary");

// Upload helper
function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

const TEMPLATE_MAP = {
  birthday: "templates/birthday.png",
  anniversary: "templates/anniversary.png",
};

async function generateImage({ name, union, type }) {
  try {
    const template = await loadImage(TEMPLATE_MAP[type] || TEMPLATE_MAP.birthday);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    // Draw template
    ctx.drawImage(template, 0, 0);

    const centerX = canvas.width / 2;

    // ===============================
    // 🎯 HEADER TEXT (Happy)
    // ===============================
    ctx.font = "italic 40px Arial";
    ctx.fillStyle = "#1E3A8A";
    ctx.textAlign = "center";
    ctx.fillText("Happy", centerX, 120);

    // ===============================
    // 🎯 MAIN TITLE (BIRTHDAY / ANNIVERSARY)
    // ===============================
    const mainText = type === "anniversary" ? "ANNIVERSARY" : "BIRTHDAY";

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#1E3A8A"); // blue
    gradient.addColorStop(1, "#DC2626"); // red

    ctx.font = "bold 110px Arial";
    ctx.fillStyle = gradient;

    // shadow for depth
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 10;

    ctx.fillText(mainText, centerX, 250);

    // reset shadow
    ctx.shadowBlur = 0;

    // ===============================
    // 🎯 BEST WISHES RIBBON STYLE
    // ===============================
    const ribbonY = 320;

    // ribbon background
    const ribbonGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    ribbonGradient.addColorStop(0, "#DC2626");
    ribbonGradient.addColorStop(1, "#1E3A8A");

    ctx.fillStyle = ribbonGradient;
    ctx.fillRect(centerX - 350, ribbonY, 700, 70);

    // ribbon text
    ctx.font = "bold 45px Arial";
    ctx.fillStyle = "#FFD700"; // gold
    ctx.fillText("BEST WISHES", centerX, ribbonY + 48);

    // ===============================
    // 🎯 MESSAGE TEXT
    // ===============================
    ctx.font = "28px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(
      "Wishing you a day filled with happiness,",
      centerX,
      ribbonY + 120
    );
    ctx.fillText(
      "good health and great success.",
      centerX,
      ribbonY + 155
    );

    // ===============================
    // 🎯 NAME (HIGHLIGHTED)
    // ===============================
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#1E3A8A";

    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 6;

    ctx.fillText(name, centerX, ribbonY + 240);

    ctx.shadowBlur = 0;

    // ===============================
    // 🎯 UNION
    // ===============================
    ctx.font = "30px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText(union, centerX, ribbonY + 290);

    // ===============================
    // 📦 BUFFER → CLOUDINARY
    // ===============================
    const buffer = canvas.toBuffer("image/png");

    const publicId = `unionwisher/${name.replace(/\s+/g, "_")}_${Date.now()}`;

    const result = await uploadBuffer(buffer, {
      folder: "unionwisher",
      public_id: publicId,
    });

    console.log("☁️ Uploaded →", result.secure_url);

    return result.secure_url;

  } catch (err) {
    console.error("❌ Image generation error:", err);
    throw err;
  }
}

module.exports = generateImage;