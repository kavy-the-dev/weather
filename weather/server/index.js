const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Replace 'YOUR_DATABASE_NAME' with the name of your MongoDB database
const MONGODB_URI = 'mongodb+srv://kavybhavsar3011:kavy3011@cluster0.1fwqsln.mongodb.net/YOUR_DATABASE_NAME';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

// Create a Mongoose model for weather data
const WeatherData = mongoose.model('WeatherData', {
  city: String,
  country: String,
  temperature: Number,
  description: String,
  icon: String,
});

// Check if the database connection is successful
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// If connection throws an error
mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit the application if failed to connect to MongoDB
});

// Route to handle storing weather data
app.post('/api/weather', async (req, res) => {
  try {
    // Extract weather data from request body
    const { city, country, temperature, description, icon } = req.body;

    // Create a new document using the WeatherData model
    const weatherData = new WeatherData({
      city,
      country,
      temperature,
      description,
      icon,
    });

    // Save the weather data to the database
    await weatherData.save();

    // Respond with success message
    res.json({ message: 'Weather data saved successfully' });
  } catch (error) {
    console.error('Error saving weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});