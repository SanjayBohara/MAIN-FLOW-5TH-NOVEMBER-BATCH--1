// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/migratedData', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MongoDB Schema
const DataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  // Add other fields as needed
});

const MigratedData = mongoose.model('MigratedData', DataSchema);

// API endpoint for fetching data
app.get('/api/data', async (req, res) => {
  try {
    const data = await MigratedData.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for creating data
app.post('/api/data', async (req, res) => {
  try {
    const newData = new MigratedData(req.body);
    await newData.save();
    res.json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add API endpoints for updating and deleting data

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
