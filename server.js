require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve images (ONLY ONCE)
app.use('/images', express.static(path.join(__dirname, 'images')));

// ✅ Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// ✅ Routes
const wishRoutes = require('./routes/wishRoutes');
app.use('/api', wishRoutes);

// ✅ Scheduler
require('./scheduler/cron');

// ✅ MongoDB Connection FIRST
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'unionwisher'
})
.then(() => {
  console.log('✅ Mongo Connected');

  // 🚀 Start server ONLY after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

})
.catch(err => {
  console.error('❌ Mongo Connection Failed:', err);
});