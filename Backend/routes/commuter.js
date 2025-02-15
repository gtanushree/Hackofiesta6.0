const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

router.get('/get-route', (req, res) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const pythonProcess = spawn('python3', ['./scripts/route_for_commuter.py', origin, destination]);

    let resultData = '';
    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        res.status(500).json({ error: 'Internal server error', details: data.toString() });
    });

    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(resultData);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to parse response', details: error.message });
        }
    });
});

module.exports = router;
