const cron = require('node-cron');
const employees = require('../data/employees');
const generateImage = require('../utils/imageGenerator');
const { sendWhatsApp } = require('../services/whatsappService');
const { sendEmail } = require('../services/emailService');
const delay = require('../utils/delay');

const todayStr = () => {
  const d = new Date();
  return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

cron.schedule('* * * * *', async () => {
  console.log("🚀 Scheduler Started");
  {
  timezone: "Asia/Kolkata"
  }

  const today = todayStr();

  for (let emp of employees) {
    try {
      let type = null;

      if (emp.dob === today) type = "birthday";
      if (emp.anniversary === today) type = "anniversary";

      if (!type) continue;

      console.log(`📤 Sending ${type} to ${emp.name}`);

      const imageUrl = await generateImage({
        name: emp.name,
        union: emp.union,
        type
      });

      await sendWhatsApp(emp.phone, imageUrl);
      await sendEmail(emp.email, imageUrl);

      await delay(3000);

    } catch (err) {
      console.error(`❌ Failed for ${emp.name}`, err.message);
    }
  }

  console.log("✅ Scheduler Completed");
});
