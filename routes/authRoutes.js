const router = require("express").Router();
const User = require("../models/User");
const Union = require("../models/Union");

//
// 🔥 GET UNIONS (FROM DB)
//
router.get("/unions", async (req, res) => {
  try {
    const unions = await Union.find({ active: true }).select("name");

    res.json(unions.map((u) => u.name));

  } catch (err) {
    console.error("❌ Fetch Unions Error:", err);
    res.status(500).json({ error: "Failed to fetch unions" });
  }
});

//
// 🔐 LOGIN
//
router.post("/login", async (req, res) => {
  try {
    const { email, password, union } = req.body;

    const user = await User.findOne({ email }).populate("union");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 🔥 UNION VALIDATION
    if (user.union.name !== union) {
      return res.status(403).json({
        error: `This account belongs to ${user.union.name}, not ${union}`,
      });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        union: user.union.name,
      },
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

//
// 🔐 CHANGE PASSWORD
//
router.post("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== currentPassword) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Change Password Error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;