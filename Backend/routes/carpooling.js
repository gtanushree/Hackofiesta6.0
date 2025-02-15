const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();

router.get("/rides", async (req, res) => {
  const { location, organization } = req.query;

  if (!location || !organization) {
    return res.status(400).json({ error: "Both location and organization are required" });
  }

  console.log(`🔍 Searching rides for location: ${location}, organization: ${organization}`);

  const pythonProcess = spawn("python3", ["./scripts/Carpooling.py", location, organization]);

  let data = "";
  let errorOccurred = false;

  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on("data", (error) => {
    console.error("❌ Python script error:", error.toString());
    errorOccurred = true;
  });

  pythonProcess.on("close", (code) => {
    if (errorOccurred) {
      return res.status(500).json({ error: "Internal server error in carpooling script" });
    }

    if (code === 0) {
      try {
        const parsedData = JSON.parse(data);
        res.json(parsedData);
      } catch (error) {
        console.error("❌ Failed to parse Python output:", error.message);
        res.status(500).json({ error: "Invalid response from carpooling.py" });
      }
    } else {
      res.status(500).json({ error: "carpooling.py execution failed" });
    }
  });
});

module.exports = router;
