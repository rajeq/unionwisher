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
// 🌐 Cloudinary Template Resolver
// ==============================
function getTemplateUrl(type, union) {
  const safeUnion = union?.replace(/\s+/g, "").toLowerCase();

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/unionwisher/templates/${type}_${safeUnion}.png`;
}

// ==============================
// 🔁 Load Template (with fallback)
// ==============================
async function loadTemplate(type, union) {
  try {
    const url = getTemplateUrl(type, union);

    console.log("🌐 TEMPLATE URL:", url);

    return await loadImage(url);
  } catch (err) {
    console.warn("⚠️ Using fallback template");

    const fallback = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/unionwisher/templates/${type}.png`;

    return await loadImage(fallback);
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
function parseDate(dateStr) {
  if (!dateStr) return null;

  // ✅ Case 1: dd-mm-yyyy
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("-");
    return new Date(`${y}-${m}-${d}`);
  }

  // ✅ Case 2: ISO / Mongo format (production)
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
  console.log("test date:", d);
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
    console.log("📌 TYPE:", type);
    console.log("📌 NAME:", name);
    console.log("📌 UNION:", union);
    console.log("📌 JOIN DATE:", joinDate);

    // 🔥 LOAD TEMPLATE FROM CLOUDINARY
    const template = await loadTemplate(type, union);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const zone = SAFE_ZONE[type];

    const x = canvas.width * (zone.x || 0.5);
    const y = canvas.height * ((zone.top + zone.bottom) / 1.8);
    // if(type === "birthday") {
    // const y = canvas.height * ((zone.top + zone.bottom) / 1.8);
    //   x += 25;
    // }
    //    if(type === "anniversary") {
    // const y = canvas.height * ((zone.top + zone.bottom) / 1.6);
    //      x += 15;
    // }
    const maxWidth = canvas.width * zone.maxWidth;

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

        const leftX = canvas.width * 0.26;   // slight right adjust
        const centerY = canvas.height * 0.50; // slight down adjust

        ctx.save();

        ctx.globalAlpha = 0.60;
        ctx.font = "bold 160px Arial";
        ctx.fillStyle = "#00f2ff";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(years, leftX, centerY);

        ctx.restore();

        // suffix (st, nd, th)
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText(suffix, leftX + 75, centerY - 70);

        console.log("✅ ANNIVERSARY DRAWN:", ordinal);
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
    // ☁️ Upload final image
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
