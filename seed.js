// require("dotenv").config();
// // const mongoose = require("mongoose");
// // const Employee = require("./models/Employee");

// // function formatDate(d) {
// //   const day = String(d.getDate()).padStart(2, "0");
// //   const month = String(d.getMonth() + 1).padStart(2, "0");
// //   const year = d.getFullYear();
// //   return `${day}-${month}-${year}`;
// // }

// // (async () => {
// //   await mongoose.connect(process.env.MONGO_URI, {
// //     dbName: "unionwisher",
// //   });

// //   const today = formatDate(new Date());
// //   const tomorrow = formatDate(new Date(Date.now() + 86400000));

// //   await Employee.deleteMany({});

// //   await Employee.insertMany([
// //     { name: "DhanaA", phone: "9440059431", email: "test1@gmail.com", union: "Union A", dob: today, joiningDate: today },
// //     { name: "DhanaB", phone: "9440059431", email: "test1@gmail.com", union: "Union B", dob: today, joiningDate: today },
// //     { name: "DhanaC", phone: "9440059431", email: "test1@gmail.com", union: "Union C", dob: today, joiningDate: today },
// //   ]);

// //   console.log("✅ Seeded");
// //   process.exit();
// // })();

// const mongoose = require("mongoose");
// // const User = require("./models/User");

// // (async () => {
// //   await mongoose.connect(process.env.MONGO_URI, {
// //     dbName: "unionwisher"
// //   });

// //   await User.deleteMany();

// //   await User.insertMany([
// //     { email: "uniona@gmail.com", password: "1234", union: "Union A" },
// //     { email: "unionb@gmail.com", password: "1234", union: "Union B" },
// //     { email: "unionc@gmail.com", password: "1234", union: "Union C" },
// //   ]);

// //   console.log("✅ Users Seeded");
// //   process.exit();
// // })();

// const Union = require("./models/Union");

// await Union.insertMany([
//   { name: "Union A" },
//   { name: "Union B" },
//   { name: "Union C" },
// ]);

require("dotenv").config();
const mongoose = require("mongoose");

const Union = require("./models/Union");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "unionwisher",
  });

  console.log("✅ Connected");

  // Clean old data
  await Union.deleteMany();
  await User.deleteMany();

  // Create unions
  const unions = await Union.insertMany([
    { name: "Union A" },
    { name: "Union B" },
    { name: "Union C" },
  ]);

  console.log("✅ Unions created");

  // Create users
  await User.insertMany([
    {
      email: "uniona@gmail.com",
      password: "1234",
      union: unions[0]._id,
    },
    {
      email: "unionb@gmail.com",
      password: "1234",
      union: unions[1]._id,
    },
    {
      email: "unionc@gmail.com",
      password: "1234",
      union: unions[2]._id,
    },
  ]);

  console.log("✅ Users created");

  process.exit();
})();