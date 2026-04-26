const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = async ({ name, union, type }) => {

  // ✅ Absolute template path (VERY IMPORTANT for Render)
  const templateMap = {
    birthday: path.join(__dirname, '../templates/birthday.png'),
    anniversary: path.join(__dirname, '../templates/anniversary.png')
  };

  const templatePath = templateMap[type];

  if (!templatePath) {
    throw new Error("Invalid type");
  }

  const template = await loadImage(templatePath);

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(template, 0, 0);

  // 🎨 Theme Colors
  const theme = {
    birthday: {
      primary: "#0A3D62",
      accent: "#1E90FF",
      text: "#FFFFFF"
    },
    anniversary: {
      primary: "#B8860B",
      accent: "#FFD700",
      text: "#FFFFFF"
    }
  };

  const currentTheme = theme[type];

  // 🌫️ Overlay
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✨ Shadow
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  ctx.textAlign = "center";

  // 🏦 Header
  ctx.fillStyle = currentTheme.accent;
  ctx.font = "bold 42px Sans-serif";
  ctx.fillText(`Union Bank - ${union}`, canvas.width / 2, 120);

  // 👤 Name
  ctx.fillStyle = currentTheme.text;
  ctx.font = "bold 75px Sans-serif";
  ctx.fillText(name, canvas.width / 2, canvas.height / 2);

  // 🎉 Message
  ctx.fillStyle = currentTheme.accent;
  ctx.font = "bold 36px Sans-serif";
  ctx.fillText(
    type === "birthday" ? "Happy Birthday 🎂" : "Happy Anniversary 💍",
    canvas.width / 2,
    canvas.height - 120
  );

  // 📏 underline
  ctx.beginPath();
  ctx.strokeStyle = currentTheme.accent;
  ctx.lineWidth = 3;
  ctx.moveTo(canvas.width / 4, canvas.height / 2 + 40);
  ctx.lineTo(canvas.width * 3 / 4, canvas.height / 2 + 40);
  ctx.stroke();

  // ✅ Ensure images folder exists
  const imagesDir = path.join(__dirname, '../images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  const fileName = `${name}_${Date.now()}.png`;
  const filePath = path.join(imagesDir, fileName);

  fs.writeFileSync(filePath, canvas.toBuffer());

  // ✅ Correct public URL
  return `${process.env.BASE_URL}/images/${fileName}`;
};