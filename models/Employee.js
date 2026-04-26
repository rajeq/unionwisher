// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  union: String,
  dob: Date,          // birthday
  joiningDate: Date   // anniversary
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);