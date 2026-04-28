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

async function generateImage({ name, type }) {
  const template = await loadImage(TEMPLATE_MAP[type]);

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  // draw template
  ctx.drawImage(template, 0, 0);

  ctx.textAlign = "center";

  // 🔥 ONLY NAME (based on template layout)

  if (type === "birthday") {
    // bottom center
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(name, canvas.width / 2, canvas.height - 150);
  }

  if (type === "anniversary") {
    // right side area
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(name, canvas.width * 0.70, canvas.height * 0.60);
  }

  const buffer = canvas.toBuffer("image/png");

  const result = await uploadBuffer(buffer, {
    folder: "unionwisher",
    public_id: `unionwisher/${Date.now()}`,
  });

  return result.secure_url;
}

module.exports = generateImage;