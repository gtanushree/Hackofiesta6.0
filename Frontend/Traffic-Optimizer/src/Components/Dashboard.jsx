import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";

// Color Scheme
const colors = {
  darkBlue: "#0a192f",
  accentGreen: "#64ffda",
  accentRed: "#f07178",
  lightText: "#ccd6f6",
  secondaryBg: "#112240",
};

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning ☀️");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
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
      {/* Greeting Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          sx={{ color: colors.accentGreen, fontWeight: "bold", mb: 3 }}
        >
          {greeting}, Welcome Back!
        </Typography>
      </motion.div>

      {/* Dashboard Cards Section */}
      <Grid container spacing={4} justifyContent="center">
        {[
          { title: "Total Rides", value: "32", color: colors.accentGreen },
          { title: "Active Carpools", value: "8", color: colors.accentRed },
          { title: "Distance Traveled", value: "540 km", color: colors.accentGreen },
        ].map((item, index) => (
          <Grid item key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card
                sx={{
                  width: 200,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  textAlign: "center",
                  padding: "1.5rem",
                  border: `2px solid ${item.color}50`,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: item.color, fontWeight: "bold" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: colors.lightText, fontWeight: "bold", mt: 1 }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
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
          View Ride History
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
