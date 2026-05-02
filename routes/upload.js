const express = require("express");
const multer = require("multer");
const Papa = require("papaparse");
const XLSX = require("xlsx");
const Employee = require("../models/Employee");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//
// 🔧 Helpers
//
const formatDate = (value) => {
  if (!value) return "";

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;

  const d = new Date(value);
  if (isNaN(d)) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

const normalize = (row) => {
  const out = {};

  for (const [k, v] of Object.entries(row || {})) {
    const key = String(k).trim().toLowerCase().replace(/\s+/g, "");

    if (key === "name") out.name = String(v ?? "");

    else if (key === "phone") {
      let phone = String(v ?? "").replace(/\D/g, "");
      if (phone.length === 10) phone = "91" + phone;
      out.phone = phone;
    }

    else if (key === "email") out.email = String(v ?? "");
    else if (key === "dob") out.dob = formatDate(v);
    else if (key === "joiningdate") out.joiningDate = formatDate(v);
  }

  return out;
};

//
// 📤 JSON Upload (FIXED)
//
router.post("/json", async (req, res) => {
  try {
    const union = req.headers["x-union"]; // 🔥 TAKE FROM HEADER

    if (!union) {
      return res.status(400).json({ message: "Union missing" });
    }

    // ✅ Support both formats
    const data = Array.isArray(req.body)
      ? req.body
      : req.body.employees;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid JSON format" });
    }

    const rows = data.map(normalize);

    const finalData = rows.map((e) => ({
      ...e,
      union, // 🔥 FORCE UNION
    }));

    const result = await Employee.insertMany(finalData);

    res.json({
      success: true,
      count: result.length,
    });

  } catch (err) {
    console.error("JSON Upload Error:", err);
    res.status(500).json({ message: "JSON upload failed" });
  }
});

//
// 📤 CSV Upload (FIXED)
//
router.post("/csv", upload.single("file"), async (req, res) => {
  try {
    const union = req.headers["x-union"];

    if (!union) {
      return res.status(400).json({ message: "Union missing" });
    }

    const text = req.file.buffer.toString("utf-8");

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data.map(normalize);

    const finalData = rows.map((e) => ({
      ...e,
      union,
    }));

    const result = await Employee.insertMany(finalData);

    res.json({
      success: true,
      count: result.length,
    });

  } catch (err) {
    console.error("CSV Upload Error:", err);
    res.status(500).json({ message: "CSV upload failed" });
  }
});

//
// 📤 Excel Upload (FIXED)
//
router.post("/excel", upload.single("file"), async (req, res) => {
  try {
    const union = req.headers["x-union"];

    if (!union) {
      return res.status(400).json({ message: "Union missing" });
    }

    const wb = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws);

    const rows = json.map(normalize);

    const finalData = rows.map((e) => ({
      ...e,
      union,
    }));

    const result = await Employee.insertMany(finalData);

    res.json({
      success: true,
      count: result.length,
    });

  } catch (err) {
    console.error("Excel Upload Error:", err);
    res.status(500).json({ message: "Excel upload failed" });
  }
});

module.exports = router;