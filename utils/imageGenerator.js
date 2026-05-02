const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./cloudinary");
const fs = require("fs");
const path = require("path");

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
// 🖼 Template Resolver
// ==============================
function getTemplatePath(type, union) {
  try {
    const safeUnion = union?.replace(/\s+/g, "").toLowerCase();

    const basePath = path.resolve(process.cwd(), "templates");

    const unionPath = path.join(basePath, `${type}_${safeUnion}.png`);
    const defaultPath = path.join(basePath, `${type}.png`);

    console.log("🧩 TYPE:", type);
    console.log("🧩 UNION:", union);
    console.log("🧩 TRY PATH:", unionPath);

    if (safeUnion && fs.existsSync(unionPath)) {
      console.log("✅ Using UNION template");
      return unionPath;
    }

    console.log("⚠️ Using DEFAULT template:", defaultPath);
    return defaultPath;

  } catch (err) {
    console.error("❌ Template resolve error:", err);
    return path.resolve(process.cwd(), "templates", `${type}.png`);
  }
}

// ==============================
// 🎯 SAFE ZONE
// ==============================
const SAFE_ZONE = {
  birthday: {
    top: 0.64,
    bottom: 0.75,
    maxWidth: 0.65,
    baseFont: 70,
    x: 0.5,
  },
  anniversary: {
    top: 0.57,
    bottom: 0.65,
    maxWidth: 0.35,
    baseFont: 55,
    x: 0.72,
  },
};

// ==============================
// 🔥 FONT AUTO FIT
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
// 🔥 DATE PARSER
// ==============================
function parseDate(ddmmyyyy) {
  if (!ddmmyyyy || !ddmmyyyy.includes("-")) return null;

  const [day, month, year] = ddmmyyyy.split("-");
  return new Date(`${year}-${month}-${day}`);
}

// ==============================
// 🎯 ANNIVERSARY LOGIC
// ==============================
function getYearsOfService(joiningDateStr) {
  const join = parseDate(joiningDateStr);

  if (!join || isNaN(join)) return NaN;

  const today = new Date();

  let years = today.getFullYear() - join.getFullYear();

  const hasPassed =
    today.getMonth() > join.getMonth() ||
    (today.getMonth() === join.getMonth() &&
      today.getDate() >= join.getDate());

  if (!hasPassed) years--;

  return years;
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ==============================
// 🎯 MAIN FUNCTION
// ==============================
async function generateImage({ name, type = "birthday", joinDate, union }) {
  try {
    const templatePath = getTemplatePath(type, union);
    console.log("🔥 FINAL TEMPLATE:", templatePath);

    const template = await loadImage(templatePath);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const zone = SAFE_ZONE[type];

    const x = canvas.width * (zone.x || 0.5);
    const y = canvas.height * ((zone.top + zone.bottom) / 2);
    const maxWidth = canvas.width * zone.maxWidth;

    console.log("📌 TYPE:", type);
    console.log("📌 NAME:", name);
    console.log("📌 JOIN DATE:", joinDate);

    let displayName = name;

    // ==============================
    // 🎯 ANNIVERSARY BIG NUMBER
    // ==============================
    if (type === "anniversary") {
      const years = getYearsOfService(joinDate);

      console.log("📌 CALCULATED YEARS:", years);

      if (!isNaN(years) && years > 0) {
        const ordinal = getOrdinal(years);
        const suffix = ordinal.replace(years, "");

        displayName = name;

        // 🔥 BIG NUMBER LEFT SIDE
        const leftX = canvas.width * 0.26;
        const centerY = canvas.height * 0.50;

        ctx.save();

        ctx.globalAlpha = 0.18;
        ctx.font = "bold 150px Arial";
        ctx.fillStyle = "#0adaf1e7";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(years, leftX, centerY);

        ctx.restore();

        // 🔥 SUFFIX
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText(suffix, leftX + 70, centerY - 60);

        console.log("✅ DRAWN ANNIVERSARY:", ordinal);
      } else {
        console.log("❌ INVALID YEARS → check joinDate");
      }
    }

    // ==============================
    // 🎯 DRAW NAME
    // ==============================
    const fontSize = getFontSize(ctx, displayName, maxWidth, zone.baseFont);
    ctx.font = `bold ${fontSize}px Arial`;

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 4;

    ctx.fillText(displayName, x, y, maxWidth);

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
    console.error("❌ Image generation error:", err);
    throw err;
  }
}

module.exports = generateImage;