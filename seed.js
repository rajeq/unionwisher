// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'unionwisher' });

  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);

  await Employee.deleteMany({}); // optional reset

  await Employee.insertMany([
    { name: "Ravi", phone: "9440059431", email: "rajeshthesoft97@gmail.com", union: "Union A", dob: today, joiningDate: today },
    { name: "Suresh", phone: "9701415172", email: "rajeshthesoft97@gmail.com", union: "Union B", dob: tomorrow, joiningDate: tomorrow },
    { name: "Dhana", phone: "9701415172", email: "rajeshthesoft97@gmail.com", union: "Union A", dob: today, joiningDate: today }
  ]);

  console.log('Seeded');
  process.exit();
})();