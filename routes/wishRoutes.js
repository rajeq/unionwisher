const router = require('express').Router();
const { sendWish } = require('../controllers/wishController');
const Employee = require('../models/Employee');

// ✅ GET all employees
router.get('/employees', async (req, res) => {
  try {
    const { union } = req.query;

    const filter = union && union !== "All" ? { union } : {};

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

router.post('/send-wish', sendWish);

// CREATE
router.post('/employee', async (req, res) => {
  const emp = await Employee.create(req.body);
  res.json(emp);
});

// UPDATE
router.put('/employee/:id', async (req, res) => {
  const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(emp);
});

// DELETE
router.delete('/employee/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;