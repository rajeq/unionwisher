const router = require('express').Router();
const { sendWish } = require('../controllers/wishController');
const Employee = require('../models/Employee');
const generateImage = require('../utils/imageGenerator');

//
// ✅ GET all employees (UPDATED: supports header + query)
//
router.get('/employees', async (req, res) => {
  try {
    const union = req.headers["x-union"] || req.query.union;

    const filter =
      union && union !== "All" ? { union } : {};

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      data: employees
    });

  } catch (err) {
    console.error("❌ Fetch Employees Error:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

//
// 🎯 SEND WISH
//
router.post('/send-wish', sendWish);

//
// ➕ CREATE EMPLOYEE (FORCE UNION)
//
router.post('/employee', async (req, res) => {
  try {
    const union = req.headers["x-union"];

    const emp = await Employee.create({
      ...req.body,
      union // 🔥 enforce union from login
    });

    res.json(emp);
  } catch (err) {
    console.error("❌ Create Employee Error:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

//
// ✏️ UPDATE EMPLOYEE (OPTIONAL: PROTECT UNION)
//
router.put('/employee/:id', async (req, res) => {
  try {
    const union = req.headers["x-union"];

    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        union // 🔥 keep union consistent
      },
      { new: true }
    );

    res.json(emp);
  } catch (err) {
    console.error("❌ Update Employee Error:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

//
// ❌ DELETE EMPLOYEE
//
router.delete('/employee/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete Employee Error:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

//
// 🎯 GENERATE IMAGE (UPDATED WITH UNION SUPPORT)
//
router.get('/generate/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const today = new Date();

    // 🔥 Parse joining date (dd-mm-yyyy)
    const [d, m] = employee.joiningDate.split("-");

    const isAnniversary =
      today.getDate() === Number(d) &&
      today.getMonth() + 1 === Number(m);

    //const type = isAnniversary ? "anniversary" : "birthday";
    const type = req.query.type || (isAnniversary ? "anniversary" : "birthday");

    // ✅ 🔥 PASS UNION HERE (CRITICAL FIX)
    const imageUrl = await generateImage({
      name: employee.name,
      type,
      joinDate: employee.joiningDate,
      union: employee.union, // 🔥 THIS ENABLES UNION TEMPLATES
    });

    res.json({
      success: true,
      type,
      imageUrl
    });

  } catch (err) {
    console.error("❌ Generate Image Error:", err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

module.exports = router;