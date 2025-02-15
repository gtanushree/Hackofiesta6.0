const express = require('express');
const axios = require('axios'); // 🔥 Import axios
const router = express.Router();

// Mock database of parking slots
const parkingSlots = [
  { id: 1, name: "IIT Hyderabad Parking", lat: 17.5450, lon: 78.5725 },
  { id: 2, name: "Lingampally Parking", lat: 17.4944, lon: 78.3150 },
  { id: 3, name: "Gachibowli Parking", lat: 17.4466, lon: 78.3526 },
];

// Function to calculate distance between two lat/lon points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Function to convert location name to coordinates using OpenStreetMap
const geocodeLocation = async (location) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'SmartTrafficAI/1.0',
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to geocode location');
  }
};

// API endpoint for fetching available parking slots
router.get("/available", async (req, res) => {
  try {
    let { location, lat, lon, radius = "1" } = req.query;
    console.log("Received request for parking slots near",location, lat, lon, "with radius:", radius);
    radius = parseFloat(radius); // 🔥 Convert radius to float

    if ((!lat || !lon) && !location) {
      return res.status(400).json({ error: "Location or coordinates required." });
    }

    if (!lat || !lon) {
      const coords = await geocodeLocation(location);
      lat = coords.lat;
      lon = coords.lon;
    } else {
      lat = parseFloat(lat);
      lon = parseFloat(lon);
    }

    console.log("Received request for parking slots near", lat, lon, "with radius:", radius);

    // Filter nearby parking slots
    const nearbySlots = parkingSlots.filter(
      (slot) => haversineDistance(lat, lon, slot.lat, slot.lon) <= radius
    );

    res.json({ availableSlots: nearbySlots });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
