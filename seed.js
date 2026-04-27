require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");

function formatDate(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "unionwisher",
  });

  const today = formatDate(new Date());
  const tomorrow = formatDate(new Date(Date.now() + 86400000));

  await Employee.deleteMany({});

  await Employee.insertMany([
    { name: "Ravi", phone: "9440059431", email: "test1@gmail.com", union: "Union A", dob: today, joiningDate: today },
    { name: "Suresh", phone: "9701415172", email: "test2@gmail.com", union: "Union B", dob: tomorrow, joiningDate: tomorrow },
    { name: "Dhana", phone: "9701415172", email: "test3@gmail.com", union: "Union A", dob: today, joiningDate: today },
    { name: "Rishan", phone: "9440059431", email: "test4@gmail.com", union: "Union A", dob: today, joiningDate: today },
  ]);

  console.log("✅ Seeded");
  process.exit();
})();