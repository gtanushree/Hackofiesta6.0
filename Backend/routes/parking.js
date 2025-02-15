const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

router.get("/available", async (req, res) => {
  const { location, lat, lon } = req.query; // ✅ Use req.query instead of req.params

  if (!location && (!lat || !lon)) {
    return res
      .status(400)
      .json({ error: "Location or coordinates (lat, lon) are required" });
  }

  const pythonProcess = spawn("python3", ["./scripts/Smart_Parking.py", location]);

  let data = "";

  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on("data", (error) => {
    console.error("Error from Python script:", error.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        const parsedData = JSON.parse(data);
        res.json(parsedData);
      } catch (error) {
        console.error("Failed to parse Python output:", error.message);
        res
          .status(500)
          .json({ error: "Invalid response from smart_parking.py" });
      }
    } else {
      console.error("smart_parking.py exited with code:", code);
      res.status(500).json({ error: "smart_parking.py execution failed" });
    }
  });
});

module.exports = router;
