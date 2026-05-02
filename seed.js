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
    { name: "DhanaA", phone: "9440059431", email: "test1@gmail.com", union: "Union A", dob: today, joiningDate: today },
    { name: "DhanaB", phone: "9440059431", email: "test1@gmail.com", union: "Union B", dob: today, joiningDate: today },
    { name: "DhanaC", phone: "9440059431", email: "test1@gmail.com", union: "Union C", dob: today, joiningDate: today },
  ]);

  console.log("✅ Seeded");
  process.exit();
})();