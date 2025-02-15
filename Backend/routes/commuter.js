const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

// Endpoint to call the Python script
router.get("/get-route", (req, res) => {
  const { origin, destination } = req.query; // Get query params

  if (!origin || !destination) {
    return res.status(400).json({ error: "Missing origin or destination" });
  }

  // Call Python script with arguments
  const pythonProcess = spawn("python3", ["./scripts/route_for_commuter.py", origin, destination]);

  let result = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data.toString()}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Python script failed" });
    }

    try {
      const jsonResult = JSON.parse(result.trim()); // Ensure proper JSON parsing
      res.json(jsonResult);
    } catch (err) {
      console.error("JSON Parsing Error:", err);
      res.status(500).json({ error: "Invalid JSON response from script" });
    }
  });
});

module.exports = router;
