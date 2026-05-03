const mongoose = require("mongoose");

const unionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: String,
    active: {
      type: Boolean,
      default: true,
    },
    logo: String,        // future use
    themeColor: String,  // future use
  },
  { timestamps: true }
);

module.exports = mongoose.model("Union", unionSchema);