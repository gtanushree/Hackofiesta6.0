import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { motion } from "framer-motion";

// Color Scheme
const colors = {
  darkBlue: "#0a192f",
  accentGreen: "#64ffda",
  accentRed: "#f07178",
  lightText: "#ccd6f6",
  secondaryBg: "#112240",
};

const AiPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch AI predictions from backend
    fetch(import.meta.env.VITE_BACKEND_URL + "/ai/predictions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch predictions");
        }
        return response.json();
      })
      .then((data) => {
        setPredictions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching predictions:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.secondaryBg,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Heading Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          sx={{ color: colors.accentGreen, fontWeight: "bold", mb: 3 }}
        >
          AI Traffic Predictions 🚦
        </Typography>
      </motion.div>

      {/* Loading State */}
      {loading && <CircularProgress sx={{ color: colors.accentGreen }} />}

      {/* Error State */}
      {error && (
        <Typography sx={{ color: colors.accentRed, fontSize: "1.2rem", mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Predictions List */}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
          {predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    width: 280,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    textAlign: "center",
                    padding: "1rem",
                    border: `2px solid ${
                      prediction.congestion > 70 ? colors.accentRed : colors.accentGreen
                    }50`,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: colors.lightText, fontWeight: "bold" }}>
                      {prediction.location}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: prediction.congestion > 70 ? colors.accentRed : colors.accentGreen,
                        fontWeight: "bold",
                        mt: 1,
                      }}
                    >
                      Congestion: {prediction.congestion}%
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Typography sx={{ color: colors.lightText, fontSize: "1.2rem", mt: 2 }}>
              No predictions available.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AiPredictions;
