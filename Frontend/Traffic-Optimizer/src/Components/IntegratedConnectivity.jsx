import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";

const IntegratedConnectivity = ({ theme }) => {
  // Define your color scheme for light and dark themes
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

  // Get the current theme colors
  const currentColors = colors[theme];

  return (
    <Box
      sx={{
        backgroundColor: currentColors.background,
        minHeight: "100vh",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: currentColors.accentGreen,
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Integrated Connectivity for Commuters
        </Typography>
      </motion.div>

      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          backgroundColor: currentColors.cardBackground,
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          p: 3,
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          border: `2px solid ${currentColors.cardBorder}`,
          mb: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="body1"
            sx={{ color: currentColors.text, mb: 2 }}
          >
            Our platform seamlessly connects various modes of transport—metro,
            bus, ride-sharing, bicycles, and walking—into one unified system.
            Plan your journey with integrated schedules, live updates, and
            shared rides to simplify your daily commute.
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: `linear-gradient(90deg, ${currentColors.accentGreen}, ${currentColors.accentRed})`,
              color: currentColors.background,
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "8px",
              "&:hover": {
                background: `linear-gradient(90deg, ${currentColors.accentGreen}, ${currentColors.accentRed})`,
              },
            }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ maxWidth: 600, width: "100%", mt: 2 }}>
        <Typography variant="h6" sx={{ color: currentColors.text }}>
          Experience a unified travel solution that links your metro, bus, bike,
          and ride-sharing options—all designed to make your commute more
          efficient and enjoyable.
        </Typography>
      </Box>
    </Box>
  );
};

export default IntegratedConnectivity;