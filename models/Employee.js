const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    union: String,

    // ✅ STRING format (dd-mm-yyyy)
    dob: String,
    joiningDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);