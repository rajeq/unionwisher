const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./cloudinary");

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

// 🎯 Config for placement (easy tuning)
const TEXT_CONFIG = {
  birthday: {
    xFactor: 0.5,
    yFactor: 0.88,
    maxWidthFactor: 0.8,
    baseFont: 70,
  },
  anniversary: {
    xFactor: 0.70,
    yFactor: 0.60,
    maxWidthFactor: 0.35,
    baseFont: 55,
  },
};

// 🔥 Auto-fit font size
function fitFont(ctx, text, maxWidth, baseSize) {
  let fontSize = baseSize;
  do {
    ctx.font = `bold ${fontSize}px Arial`;
    fontSize--;
  } while (ctx.measureText(text).width > maxWidth && fontSize > 20);
  return ctx.font;
}

async function generateImage({ name, type = "birthday" }) {
  const templatePath = TEMPLATE_MAP[type] || TEMPLATE_MAP.birthday;
  const template = await loadImage(templatePath);

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  // draw template
  ctx.drawImage(template, 0, 0);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const config = TEXT_CONFIG[type];

  const x = canvas.width * config.xFactor;
  const y = canvas.height * config.yFactor;
  const maxWidth = canvas.width * config.maxWidthFactor;

  // 🎯 dynamic font
  fitFont(ctx, name, maxWidth, config.baseFont);

  ctx.fillStyle = "#FFFFFF";

  // subtle shadow (helps readability on any bg)
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 6;

  ctx.fillText(name, x, y, maxWidth);

  ctx.shadowBlur = 0;

  // upload
  const buffer = canvas.toBuffer("image/png");

  const result = await uploadBuffer(buffer, {
    folder: "unionwisher",
    public_id: `unionwisher/${name.replace(/\s+/g, "_")}_${Date.now()}`,
  });

  return result.secure_url;
}

module.exports = generateImage;