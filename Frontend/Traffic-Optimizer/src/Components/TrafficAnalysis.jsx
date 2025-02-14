import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import {
  TextField,
  Button as MuiButton,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json";
import Icon from "../assets/images/marker-icon.png";
import { useRouteError } from "react-router-dom";

// Color Scheme
const colors = {
  darkBlue: "#0a192f",
  accentGreen: "#64ffda",
  accentRed: "#f07178",
  lightText: "#ccd6f6",
  secondaryBg: "#112240",
};

const customIcon = L.icon({
  iconUrl: Icon,
  iconSize: [32, 52],
  iconAnchor: [16, 52],
  popupAnchor: [1, -34],
});

// Update map bounds when both start and destination coordinates are available.
const UpdateMapBounds = ({
  startCoords,
  destinationCoords,
  fallbackCenter,
}) => {
  const map = useMap();
  useEffect(() => {
    if (startCoords && destinationCoords) {
      const bounds = L.latLngBounds([startCoords, destinationCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (fallbackCenter) {
      map.setView(fallbackCenter, 13);
    }
  }, [startCoords, destinationCoords, fallbackCenter, map]);
  return null;
};

const TrafficAnalysis = () => {
  const [route, setRoute] = useState({
    start: "",
    destination: "",
    loading: false,
    error: null,
    path: null,
    startCoords: null,
    destinationCoords: null,
    distance: null,
    duration: null,
    userLocation: null,
    congestion: "Low",
    vehicleCount: 0,
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [star,setStar]=useState("");
  const [dest,setDest]=useState("");

  // Retrieve user's current location on mount.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRoute((prev) => ({
            ...prev,
            userLocation: [latitude, longitude],
          }));
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  }, []);

  const calculateRoute = async () => {
    if (!dest) {
      setRoute((prev) => ({
        ...prev,
        error: "Please enter destination coordinates",
      }));
      return;
    }

    let startInput = star.trim();
    if (!startInput && route.userLocation) {
      startInput = `${route.userLocation[0]},${route.userLocation[1]}`;
    }
    if (!startInput) {
      setRoute((prev) => ({
        ...prev,
        error: "Please provide start coordinates or enable location services",
      }));
      return;
    }

    setRoute((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        (import.meta.env.VITE_BACKEND_URL+"/routing/calculate-route"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start: startInput,
            destination: dest.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Route calculation failed");
      }

      const result = await response.json();
      setRoute((prev) => ({
        ...prev,
        path: result.path,
        startCoords: result.startCoords,
        destinationCoords: result.destinationCoords,
        distance: result.distance,
        duration: result.duration,
        congestion: result.congestion || "Low",
        loading: false,
        vehicleCount: result.vehicle_count || 0,
        start: star,
        destination:dest,
      }));
    } catch (error) {
      setRoute((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  const fetchLocationSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await response.json();
        setLocationSuggestions(
          data.map((item) => ({
            label: item.display_name,
            value: `${item.lat},${item.lon}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching location suggestions");
      }
    }
  };

  const startMarkerPosition =
    route.start && route.startCoords ? route.startCoords : route.userLocation;
  const fallbackCenter = startMarkerPosition || [20.5937, 78.9629];

  return (
    <div
      style={{
        backgroundColor: colors.darkBlue,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: colors.accentGreen,
          textAlign: "center",
          marginBottom: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Route Planner
      </Typography>

      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          mb: 4,
          padding: "1rem",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${colors.darkBlue}, ${colors.secondaryBg})`, // Gradient container
          boxShadow: `0 8px 24px ${colors.accentGreen}40`, // Subtle glow
        }}
      >
        {/* Start TextField */}
        <TextField
          fullWidth
          label="Start"
          variant="filled"
          value={star}
          onChange={(e) =>
            setStar(e.target.value)
          }
          InputProps={{
            endAdornment: (
              <DirectionsIcon
                sx={{
                  color: colors.accentGreen,
                  animation: "pulse 1.5s infinite alternate", // Neon pulse effect
                }}
              />
            ),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Frosted glass effect
            backdropFilter: "blur(10px)", // Glassmorphism blur
            borderRadius: "8px",
            "& .MuiFilledInput-root": {
              height: 56,
              borderRadius: "8px",
              paddingTop: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              transition: "box-shadow 0.3s ease", // Smooth transition for focus glow
            },
            "& .MuiInputLabel-root": {
              color: `${colors.lightText}CC`,
              fontSize: "0.85rem",
            },
            "& .MuiFilledInput-input": {
              color: colors.lightText,
              fontSize: "0.95rem",
              lineHeight: "56px",
            },
            "& .MuiFilledInput-root.Mui-focused": {
              boxShadow: `0 0 16px ${colors.accentGreen}`, // Stronger neon glow
            },
          }}
        />

        {/* Destination TextField */}
        <TextField
          fullWidth
          label="Destination"
          variant="filled"
          value={dest}
          onChange={(e) =>
            setDest(e.target.value)
          }
          InputProps={{
            endAdornment: (
              <DirectionsIcon
                sx={{
                  color: colors.accentRed,
                  animation: "pulse 1.5s infinite alternate", // Neon pulse effect
                }}
              />
            ),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Frosted glass effect
            backdropFilter: "blur(10px)", // Glassmorphism blur
            borderRadius: "8px",
            "& .MuiFilledInput-root": {
              height: 56,
              borderRadius: "8px",
              paddingTop: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              transition: "box-shadow 0.3s ease", // Smooth transition for focus glow
            },
            "& .MuiInputLabel-root": {
              color: `${colors.lightText}CC`,
              fontSize: "0.85rem",
            },
            "& .MuiFilledInput-input": {
              color: colors.lightText,
              fontSize: "0.95rem",
              lineHeight: "56px",
            },
            "& .MuiFilledInput-root.Mui-focused": {
              boxShadow: `0 0 16px ${colors.accentRed}`, // Stronger neon glow
            },
          }}
        />

        {/* Button */}
        <MuiButton
          fullWidth
          variant="contained"
          onClick={calculateRoute}
          disabled={route.loading}
          sx={{
            backgroundColor: `linear-gradient(90deg, ${colors.accentGreen}, ${colors.accentBlue})`, // Gradient button
            color: colors.darkBlue,
            fontWeight: "bold",
            fontSize: "0.95rem",
            height: 56,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease", // Hover animations
            boxShadow: `0 4px 12px ${colors.accentGreen}80`,
            "&:hover": {
              transform: "scale(1.05)", // Slightly grow on hover
              boxShadow: `0 8px 20px ${colors.accentGreen}80`, // Enhanced glow
            },
            "&:disabled": {
              backgroundColor: `${colors.accentGreen}80`,
              color: `${colors.darkBlue}80`,
            },
          }}
          startIcon={
            route.loading && (
              <Lottie
                animationData={loadingAnimation}
                style={{ width: 40, height: 40 }}
              />
            )
          }
        >
          {route.loading ? "Calculating Route..." : "Find Optimal Route"}
        </MuiButton>
      </Box>

      {route.error && (
        <Typography
          sx={{
            color: colors.accentRed,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "1.5rem",
          }}
        >
          ⚠️ {route.error}
        </Typography>
      )}

      <Box
        sx={{
          height: "60vh",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: `0 8px 32px ${colors.darkBlue}80`,
          marginBottom: "2rem",
        }}
      >
        <MapContainer
          center={fallbackCenter}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en"
          />

          <UpdateMapBounds
            startCoords={route.startCoords || route.userLocation}
            destinationCoords={route.destinationCoords}
            fallbackCenter={fallbackCenter}
          />
          {startMarkerPosition && (
            <Marker position={startMarkerPosition} icon={customIcon}>
              <Popup>{route.start ? route.start : "Current Location"}</Popup>
            </Marker>
          )}
          {route.destinationCoords && (
            <Marker position={route.destinationCoords} icon={customIcon}>
              <Popup>{route.destination}</Popup>
            </Marker>
          )}
          {route.path && (
            <Polyline
              positions={route.path}
              pathOptions={{ color: "purple", weight: 5 }}
            />
          )}
        </MapContainer>
      </Box>

      {/* Keyframes for Neon Pulse Effect */}

      {route.error && (
        <Typography
          sx={{
            color: colors.accentRed,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "1.5rem",
          }}
        >
          ⚠️ {route.error}
        </Typography>
      )}

      {/* Results Card */}
      {route.distance && route.duration && (
        <Box
          sx={{
            backgroundColor: "rgba(17, 34, 64, 0.85)",
            backdropFilter: "blur(6px)",
            p: 3,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            border: `2px solid ${colors.accentGreen}`,
            maxWidth: 500,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen,
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Distance:{" "}
            {route.distance < 1
              ? `${(route.distance * 1000).toFixed(0)} m`
              : `${route.distance.toFixed(2)} Km`}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.accentRed,
              fontWeight: "bold",
              mt: 1,
              fontSize: "1.2rem",
            }}
          >
            Time Required:{" "}
            {route.duration / 60 < 1
              ? `${route.duration.toFixed(0)} Minutes`
              : `${(route.duration / 60).toFixed(2)} Hours`}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.lightText,
              fontWeight: "bold",
              mt: 1,
              fontSize: "1.2rem",
            }}
          >
            Congestion Level: {route.congestion || "Low"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.lightText,
              fontWeight: "bold",
              mt: 1,
              fontSize: "1.2rem",
            }}
          >
            Vehicle Count: {route.vehicleCount || "Low"}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default TrafficAnalysis;
