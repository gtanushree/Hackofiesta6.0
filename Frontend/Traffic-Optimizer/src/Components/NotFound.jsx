import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typography, Box, Button } from "@mui/material";

const NotFound = () => {
  const [ghostPos, setGhostPos] = useState({ x: 100, y: 100 });
  const [caught, setCaught] = useState(false);
  const ghostRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (ghostRef.current) {
        const rect = ghostRef.current.getBoundingClientRect();
        const ghostX = rect.left + rect.width / 2;
        const ghostY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - ghostX, e.clientY - ghostY);

        // If the cursor gets too close to the ghost, move it to a new random position.
        if (distance < 100) {
          const newX = Math.random() * (window.innerWidth - rect.width);
          const newY = Math.random() * (window.innerHeight - rect.height);
          setGhostPos({ x: newX, y: newY });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGhostClick = () => {
    setCaught(true);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4"
      style={{backgroundColor: "#0a192f", width: "100%", height: "100vh"}}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className="text-5xl font-extrabold text-white mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        404 - Page Not Found
      </motion.h2>
      <motion.p
        className="text-lg text-white mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        The page you’re looking for doesn’t exist.
      </motion.p>
      <Link to="/">
        <Button variant="contained" color="primary" size="large">
          Go Home
        </Button>
      </Link>

      {/* Interactive Game: Catch the Ghost */}
      <Box mt={8} textAlign="center" position="relative" width="100%" height="100%" style={{ backgroundColor: "#0a192f" }}>
        <Typography variant="h6" className="text-white mb-2">
          Catch the Ghost!
        </Typography>
        {!caught ? (
          <motion.div
            ref={ghostRef}
            onClick={handleGhostClick}
            style={{ position: "absolute", cursor: "pointer" }}
            animate={{ left: ghostPos.x, top: ghostPos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img
              src="https://img.icons8.com/emoji/96/000000/ghost-emoji.png"
              alt="Ghost"
              style={{ width: "100px", height: "100px" }}
            />
          </motion.div>
        ) : (
          <Typography variant="h5" className="text-green-400">
            You caught the ghost!
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default NotFound;
