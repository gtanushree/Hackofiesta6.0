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
import {
  TextField, // Import TextField here
  Button as MuiButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json";
import NavigatorIcon from "../assets/images/navigator-icon.svg"; // Add your navigator icon SVG

// Color Scheme
const colors = {
  darkBlue: "#0a192f",
  accentGreen: "#64ffda",
  accentRed: "#f07178",
  lightText: "#ccd6f6",
  secondaryBg: "#112240",
};

// Custom icons
const customIcon = L.icon({
  iconUrl: NavigatorIcon, // Use the navigator icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [1, -34],
});

const destinationIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Default Leaflet icon for destination
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Update map bounds when both start and destination coordinates are available.
const UpdateMapBounds = ({ startCoords, destinationCoords, fallbackCenter }) => {
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

const NavigateMe = () => {
  const [end, setEnd] = useState(""); // End location as text input
  const [mode, setMode] = useState("driving"); // Mode of transport
  const [route, setRoute] = useState(null); // Route coordinates
  const [steps, setSteps] = useState([]); // Step-by-step instructions
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [startCoords, setStartCoords] = useState(null); // Start coordinates (current location)
  const [destinationCoords, setDestinationCoords] = useState(null); // Destination coordinates
  const [currentLocation, setCurrentLocation] = useState(null); // Current location from GPS
  const [distance, setDistance] = useState(null); // Distance in meters
  const [duration, setDuration] = useState(null); // Duration in seconds
  const [speed, setSpeed] = useState(null); // Current speed in m/s
  const [remainingTime, setRemainingTime] = useState(null); // Remaining time in seconds
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Current step index

  // Get current location and speed using GPS
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setSpeed(speed || 0); // Speed in m/s (default to 0 if unavailable)
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Unable to retrieve your location. Please enable location services.");
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId); // Cleanup watchPosition
    } else {
      alert("Geolocation is not supported by your browser. Please enable location services.");
    }
  }, []);

  // Update start coordinates when current location changes
  useEffect(() => {
    if (currentLocation) {
      setStartCoords(currentLocation);
    }
  }, [currentLocation]);

  // Update remaining time based on speed and distance
  useEffect(() => {
    if (distance && speed > 0) {
      const remainingTimeInSeconds = distance / speed; // Distance in meters, speed in m/s
      setRemainingTime(remainingTimeInSeconds);
    }
  }, [distance, speed]);

  // Function to geocode an address (convert text to coordinates)
  const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]; // Return [lat, lon]
    }
    return null;
  };

  // Calculate route between start and end points
  const calculateRoute = async () => {
    if (!end) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endCoordsTemp = await geocodeAddress(end);

      if (!endCoordsTemp) {
        setError("Invalid destination.");
        return;
      }

      setDestinationCoords(endCoordsTemp);

      // Enable steps in the OSRM API request
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${mode}/${startCoords[1]},${startCoords[0]};${endCoordsTemp[1]},${endCoordsTemp[0]}?overview=full&geometries=geojson&steps=true`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry.coordinates);
        setDistance(data.routes[0].distance); // Distance in meters
        setDuration(data.routes[0].duration); // Duration in seconds
        if (data.routes[0].legs && data.routes[0].legs.length > 0 && data.routes[0].legs[0].steps) {
          setSteps(data.routes[0].legs[0].steps);
          speakDirections(data.routes[0].legs[0].steps[0]); // Speak the first instruction
        } else {
          setSteps([]); // No steps available
        }
      } else {
        setError("No route found.");
      }
    } catch (error) {
      setError("Failed to calculate route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Speak the current step's instruction
  const speakDirections = (step) => {
    if (!step || !step.distance) {
      console.error("Invalid step object:", step);
      return;
    }
    const instruction = step.maneuver?.instruction || "Continue straight";
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(`In ${Math.round(step.distance)} meters, ${instruction}`);
    synth.speak(utterance);
  };

  // Handle mode of transport change
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  // Convert distance to kilometers if > 1000 meters
  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${Math.round(distance)} meters`;
  };

  // Convert time to hours if > 60 minutes
  const formatTime = (time) => {
    if (time >= 3600) {
      return `${(time / 3600).toFixed(2)} hours`;
    } else if (time >= 60) {
      return `${(time / 60).toFixed(2)} minutes`;
    }
    return `${Math.round(time)} seconds`;
  };

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
        NavigateMe
      </Typography>

      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.5fr 1.5fr 1.5fr" },
          gap: 2,
          mb: 4,
          padding: "1rem",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${colors.darkBlue}, ${colors.secondaryBg})`,
          boxShadow: `0 8px 24px ${colors.accentGreen}40`,
        }}
      >
        {/* Destination TextField */}
        <TextField
          fullWidth
          label="Destination"
          variant="filled"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          InputProps={{
            endAdornment: (
              <DirectionsIcon
                sx={{
                  color: colors.accentRed,
                  animation: "pulse 1.5s infinite alternate",
                }}
              />
            ),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            "& .MuiFilledInput-root": {
              height: 56,
              borderRadius: "8px",
              paddingTop: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              transition: "box-shadow 0.3s ease",
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
              boxShadow: `0 0 16px ${colors.accentRed}`,
            },
          }}
        />

        {/* Mode of Transport Dropdown */}
        <TextField
          fullWidth
          select
          label="Mode of Transport"
          value={mode}
          onChange={handleModeChange}
          SelectProps={{
            native: true,
          }}
          variant="filled"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            "& .MuiFilledInput-root": {
              height: 56,
              borderRadius: "8px",
              paddingTop: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              transition: "box-shadow 0.3s ease",
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
              boxShadow: `0 0 16px ${colors.accentGreen}`,
            },
          }}
        >
          <option value="driving">Driving</option>
          <option value="walking">Walking</option>
          <option value="cycling">Cycling</option>
        </TextField>

        {/* Button */}
        <MuiButton
          fullWidth
          variant="contained"
          onClick={calculateRoute}
          disabled={loading}
          sx={{
            backgroundColor: `linear-gradient(90deg, ${colors.accentGreen}, ${colors.accentBlue})`,
            color: colors.darkBlue,
            fontWeight: "bold",
            fontSize: "0.95rem",
            height: 56,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: `0 4px 12px ${colors.accentGreen}80`,
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: `0 8px 20px ${colors.accentGreen}80`,
            },
            "&:disabled": {
              backgroundColor: `${colors.accentGreen}80`,
              color: `${colors.darkBlue}80`,
            },
          }}
          startIcon={
            loading && (
              <Lottie
                animationData={loadingAnimation}
                style={{ width: 40, height: 40 }}
              />
            )
          }
        >
          {loading ? "Calculating Route..." : "Find Route"}
        </MuiButton>
      </Box>

      {error && (
        <Typography
          sx={{
            color: colors.accentRed,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "1.5rem",
          }}
        >
          ⚠️ {error}
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
          center={startCoords || [20.5937, 78.9629]}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en"
          />

          <UpdateMapBounds
            startCoords={startCoords}
            destinationCoords={destinationCoords}
            fallbackCenter={startCoords || [20.5937, 78.9629]}
          />
          {startCoords && (
            <Marker position={startCoords} icon={customIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {destinationCoords && (
            <Marker position={destinationCoords} icon={destinationIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}
          {route && (
            <Polyline
              positions={route.map(coord => [coord[1], coord[0]])}
              pathOptions={{ color: "purple", weight: 5 }}
            />
          )}
        </MapContainer>
      </Box>

      {/* Step-by-Step Directions */}
      {steps.length > 0 && (
        <Box
          sx={{
            backgroundColor: "rgba(17, 34, 64, 0.85)",
            backdropFilter: "blur(6px)",
            p: 3,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            border: `2px solid ${colors.accentGreen}`,
            maxWidth: "75%",
            maxHeight: "50vh",
            overflowY: "auto",
            scroll: "smooth",
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
              mb: 2,
            }}
          >
            Step-by-Step Directions
          </Typography>
          <List>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Step ${index + 1}: ${step.maneuver?.instruction || "Continue straight"}`}
                    secondary={`In ${formatDistance(step.distance)} (${formatTime(step.duration)})`}
                    primaryTypographyProps={{ color: colors.lightText }}
                    secondaryTypographyProps={{ color: colors.accentRed }}
                  />
                </ListItem>
                {index < steps.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {/* Distance, Time, and Speed */}
      {distance && duration && (
        <Box
          sx={{
            backgroundColor: "rgba(17, 34, 64, 0.85)",
            backdropFilter: "blur(6px)",
            p: 3,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            border: `2px solid ${colors.accentGreen}`,
            maxWidth: "75%",
            mx: "auto",
            textAlign: "center",
            mt: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen,
              fontWeight: "bold",
              fontSize: "1.2rem",
              mb: 1,
            }}
          >
            Distance: {formatDistance(distance)}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.accentRed,
              fontWeight: "bold",
              fontSize: "1.2rem",
              mb: 1,
            }}
          >
            Estimated Time: {formatTime(duration)}
          </Typography>
          {speed !== null && (
            <Typography
              variant="h6"
              sx={{
                color: colors.lightText,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Current Speed: {(speed * 3.6).toFixed(2)} km/h
            </Typography>
          )}
          {remainingTime && (
            <Typography
              variant="h6"
              sx={{
                color: colors.lightText,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Remaining Time: {formatTime(remainingTime)}
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default NavigateMe;