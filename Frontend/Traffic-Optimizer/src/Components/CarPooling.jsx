import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";

const colors = {
  dark: {
    background: "#112240",
    accentGreen: "#64ffda",
    accentRed: "#f07178",
    text: "#ccd6f6",
    cardBackground: "rgba(255, 255, 255, 0.1)",
    cardBorder: "rgba(100, 255, 218, 0.5)",
  },
  light: {
    background: "#ffffff",
    accentGreen: "#00bcd4",
    accentRed: "#ff5252",
    text: "#333333",
    cardBackground: "rgba(0, 0, 0, 0.1)",
    cardBorder: "rgba(0, 188, 212, 0.5)",
  },
};

const GlassmorphicCard = ({ children, theme }) => {
  const currentColors = colors[theme];
  return (
    <Box
      sx={{
        maxWidth: "800px",
        width: "100%",
        background: currentColors.cardBackground,
        borderRadius: "16px",
        padding: "2rem",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
        border: `2px solid ${currentColors.cardBorder}`,
        textAlign: "center",
      }}
    >
      {children}
    </Box>
  );
};

const Carpooling = ({ theme }) => {
  const currentColors = colors[theme];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: currentColors.background,
        padding: { xs: "1rem", sm: "2rem" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: currentColors.accentGreen,
            mb: 3,
            fontWeight: "bold",
          }}
        >
          Carpooling
        </Typography>
      </motion.div>

      <GlassmorphicCard theme={theme}>
        <Typography variant="body1" sx={{ color: currentColors.text, mb: 2 }}>
          Welcome to the Carpooling page. Here you can join or offer rides to reduce your carbon footprint and save on travel costs.
        </Typography>
        <Typography variant="body1" sx={{ color: currentColors.text, mb: 2 }}>
          Explore available carpool options, view schedules, and connect with drivers or fellow commuters.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              background: `linear-gradient(90deg, ${currentColors.accentGreen}, ${currentColors.accentRed})`,
              color: currentColors.background,
              fontWeight: "bold",
              paddingX: "2rem",
              paddingY: "1rem",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            Join a Carpool
          </Button>
        </Box>
      </GlassmorphicCard>
    </Box>
  );
};

export default Carpooling;