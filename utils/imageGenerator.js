const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

module.exports = async ({ name, union, type }) => {

  const templateMap = {
    birthday: 'templates/birthday.png',
    anniversary: 'templates/anniversary.png'
  };

  const template = await loadImage(templateMap[type]);
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(template, 0, 0);

  // 🎨 Theme Colors
  const theme = {
    birthday: {
      primary: "#0A3D62",     // Union Bank blue
      accent: "#1E90FF",
      text: "#FFFFFF"
    },
    anniversary: {
      primary: "#B8860B",     // gold
      accent: "#FFD700",
      text: "#FFFFFF"
    }
  };

  const currentTheme = theme[type];

  // 🌫️ Overlay for better readability
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✨ Text Shadow for premium look
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  ctx.textAlign = "center";

  // 🏦 Header (Top)
  ctx.fillStyle = currentTheme.accent;
  ctx.font = "bold 42px Sans-serif";
  ctx.fillText(`Union Bank - ${union}`, canvas.width / 2, 120);

  // 👤 Name (Center Focus)
  ctx.fillStyle = currentTheme.text;
  ctx.font = "bold 75px Sans-serif";
  ctx.fillText(name, canvas.width / 2, canvas.height / 2);

  // 🎉 Message (Bottom)
  ctx.fillStyle = currentTheme.accent;
  ctx.font = "bold 36px Sans-serif";
  ctx.fillText(
    type === "birthday" ? "Happy Birthday 🎂" : "Happy Anniversary 💍",
    canvas.width / 2,
    canvas.height - 120
  );

  // 📏 Optional underline accent (modern touch)
  ctx.beginPath();
  ctx.strokeStyle = currentTheme.accent;
  ctx.lineWidth = 3;
  ctx.moveTo(canvas.width / 4, canvas.height / 2 + 40);
  ctx.lineTo(canvas.width * 3 / 4, canvas.height / 2 + 40);
  ctx.stroke();

  const fileName = `${name}_${Date.now()}.png`;
  const path = `images/${fileName}`;

  fs.writeFileSync(path, canvas.toBuffer());

  return `${process.env.BASE_URL}/${path}`;
};