const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/f11-routes'));
app.use('/api', require('./routes/f12-routes'));

// Fallback for missing routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`SenseHire backend running on port ${port}`);
});
