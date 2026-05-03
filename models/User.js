const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔥 IMPORTANT CHANGE (REFERENCE)
    union: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Union",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);