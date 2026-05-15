const cron = require('node-cron');
const Employee = require('../models/Employee');

const generateImage = require('../utils/imageGenerator');
const { sendWhatsApp } = require('../services/whatsappService');
const { sendEmail } = require('../services/emailService');
const delay = require('../utils/delay');

console.log("✅ Cron Scheduler Loaded");

// ✅ Today's date in MM-DD format
const todayStr = () => {
  const d = new Date();

  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

// ✅ TESTING EVERY MINUTE
cron.schedule(
  '* * * * *',
  async () => {
    console.log("🚀 Scheduler Started");

    try {

      const today = todayStr();

      console.log("📅 Today:", today);

      // ✅ Fetch employees from MongoDB
      const employees = await Employee.find();

      console.log(`👥 Employees Found: ${employees.length}`);

      for (let emp of employees) {
        try {

          let type = null;

          // ✅ Check birthday
          if (emp.dob === today) {
            type = "birthday";
          }

          // ✅ Check anniversary
          if (emp.anniversary === today) {
            type = "anniversary";
          }

          // ✅ Skip if no event today
          if (!type) {
            continue;
          }

          console.log(`📤 Sending ${type} wish to ${emp.name}`);

          // ✅ Generate image
          const imageUrl = await generateImage({
            name: emp.name,
            union: emp.union,
            type
          });

          console.log("🖼️ Image Generated:", imageUrl);

          // ✅ Send WhatsApp
          if (emp.phone) {
            await sendWhatsApp(emp.phone, imageUrl);
            console.log("📱 WhatsApp Sent");
          }

          // ✅ Send Email
          if (emp.email) {
            await sendEmail(emp.email, imageUrl);
            console.log("📧 Email Sent");
          }

          // ✅ Delay to avoid API overload
          await delay(3000);

        } catch (err) {
          console.error(`❌ Failed for ${emp.name}`, err.message);
        }
      }

      console.log("✅ Scheduler Completed");

    } catch (err) {
      console.error("❌ Scheduler Error:", err.message);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
);
