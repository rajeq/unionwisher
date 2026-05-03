require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static files
app.use('/images', express.static(path.join(__dirname, 'images')));

// ✅ Health
app.get('/health', (req, res) => res.send('OK'));


// ✅ Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ Routes
const wishRoutes = require('./routes/wishRoutes');
app.use('/api', wishRoutes);

// ✅ Upload routes (IMPORTANT: before server start)
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// ✅ Scheduler
require('./scheduler/cron');

// ✅ Mongo connect
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'unionwisher'
})
.then(() => {
  console.log('✅ Mongo Connected');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

})
.catch(err => {
  console.error('❌ Mongo Connection Failed:', err);
});