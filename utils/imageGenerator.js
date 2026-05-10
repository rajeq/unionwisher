


Logo RemoveUnion bank APUBOA logo in the image and give me

Generated image: Work anniversary celebration with elegance


Edit


Do the same thing for this image aswell

Generated image: Bright birthday celebration with gifts and balloons


Edit


Uploaded image
Uploaded image
Now see this.. Other two logos are added... Same logos... Need to add to the previously removed ones.. 

Generated image: Festive birthday greeting with balloons and gifts


Edit


Below logo required 

Generated image: Happy birthday celebration with corporate flair


Edit


Below logo not required.... Sorry

Generated image: Happy birthday celebration with gifts and balloons


Edit


Uploaded image
Do the same thing for this as well 

Generated image: Celebrating dedication and teamwork


Edit


Uploaded image
Uploaded image
These are original logos you should keep.. Don't alter any... Keep this logo adjusted... And give... 

Generated image: Happy work anniversary celebration design


Edit


Uploaded image
don''t change the size or any of any alignment... just remove the below logo.. add the previously added logos....   Strict node.. don't later or adjust text in that....keep follow the strict rules 

Generated image: Happy birthday wishes and celebration


Edit


Uploaded image
follow the same strict rules to this aswell.. like....don''t change the size or any of any alignment... just remove the below logo.. add the previously added logos.... Strict node.. don't later or adjust text in that....keep follow the strict rules

Generated image: Work anniversary gratitude graphic


Edit



Pasted text.txt
Document
in the above code, name I need to bring little bit down ... at the same place.. for both birthday and anniversary

For both birthday and anniversary, you only need to move the name text slightly down without changing alignment, size, positioning logic, or anything else. 


Replace this section:

const y = canvas.height * ((zone.top + zone.bottom) / 2);
with this:

const y =
  canvas.height * ((zone.top + zone.bottom) / 2) + 25;
If you want it even lower:

+ 35
or

+ 40
Recommended:

const y =
  canvas.height * ((zone.top + zone.bottom) / 2) + 30;
This will:

Keep exact same alignment

Keep exact same font sizing

Keep exact same safe-zone logic

Only move the name slightly downward for both templates

No other UI/text/logo changes whatsoever


25 I kept, it went to top 

Because your canvas coordinate system is already centered based on the safe-zone calculation, positive/negative movement may behave opposite depending on template alignment and textBaseline.

To move the name down, use:

const y =
  canvas.height * ((zone.top + zone.bottom) / 2) - 25;
If you want slightly lower:

- 35
Recommended:

const y =
  canvas.height * ((zone.top + zone.bottom) / 2) - 30;
Only this line should change. Everything else remains untouched.


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

return https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/unionwisher/templates/${type}_${safeUnion}.png;
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
ctx.font = bold ${size}px Arial;
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
return new Date(${y}-${m}-${d});
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
const y = canvas.height * ((zone.top + zone.bottom) / 2) + 25;
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
