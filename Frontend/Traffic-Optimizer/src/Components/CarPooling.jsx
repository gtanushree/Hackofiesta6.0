import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";

// Color Scheme
const colors = {
  darkBlue: "#0a192f",
  accentGreen: "#64ffda",
  accentRed: "#f07178",
  lightText: "#ccd6f6",
  secondaryBg: "#112240",
};

const Carpooling = () => {
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
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: colors.accentGreen,
            mb: 3,
            fontWeight: "bold",
          }}
        >
          Carpooling
        </Typography>
      </motion.div>

      {/* Glassmorphic Card */}
      <Box
        sx={{
          maxWidth: "800px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
          border: `2px solid ${colors.accentGreen}50`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: colors.lightText,
            mb: 2,
          }}
        >
          Welcome to the Carpooling page. Here you can join or offer rides to reduce your carbon footprint and save on travel costs.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.lightText,
            mb: 2,
          }}
        >
          Explore available carpool options, view schedules, and connect with drivers or fellow commuters.
        </Typography>

        {/* Call-to-Action Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              background: `linear-gradient(90deg, ${colors.accentGreen}, ${colors.accentRed})`,
              color: colors.darkBlue,
              fontWeight: "bold",
              paddingX: "2rem",
              paddingY: "1rem",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              "&:hover": {
                background: `linear-gradient(90deg, ${colors.accentGreen}, ${colors.accentRed})`,
              },
            }}
          >
            Join a Carpool
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Carpooling;
