require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const wishRoutes = require('./routes/wishRoutes');

app.use(cors());
app.use(express.json());

// Serve images
app.use('/images', express.static('images'));

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Routes
app.use('/api', wishRoutes);

// ✅ ADD THIS (important)
require('./scheduler/cron');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});