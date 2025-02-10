import React, { useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import "animate.css/animate.min.css";

function FloatingTrafficElements() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Stars radius={150} depth={80} count={1000} factor={5} saturation={0} />
      <ambientLight intensity={1.2} color="cyan" />
      <pointLight position={[100, 150, 100]} intensity={2.5} color="cyan" />

      {/* Animated Traffic Particles */}
      {[...Array(200)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            Math.random() * 40 - 20,
            Math.random() * 10,
            Math.random() * 40 - 20,
          ]}
          args={[0.1, 16, 16]}
        >
          <meshStandardMaterial
            color={Math.random() > 0.5 ? "white" : "cyan"}
            metalness={0.9}
            roughness={0.1}
            emissive={Math.random() > 0.5 ? "white" : "cyan"}
            emissiveIntensity={2}
          />
        </Sphere>
      ))}
    </Canvas>
  );
}

function Home() {
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/mainpage");
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#0a192f" }}>
      <div style={{position:"absolute",zIndex:"0",height:"100%",width:"100%"}}>
        <FloatingTrafficElements />
      </div>
      <Container className="flex justify-center items-center h-screen relative overflow-hidden w-screen z-10">
        <div className="w-full w-screen space-y-8 relative z-1" style={{marginTop:"10vh"}}>
          {/* Main Holographic Interface */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="perspective-2000"
          >
            <Card
              className="bg-black/60 backdrop-blur-2xl border-2 border-cyan-400/30 rounded-3xl p-8 
          shadow-[0_0_80px_rgba(0,255,255,0.3)] hover:shadow-[0_0_120px_rgba(255,0,255,0.5)]
          transform-style-preserve-3d group relative overflow-hidden"
            >
              {/* Animated Grid Background */}
              <Card.Body className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center mb-8"
                >
                  <h1
                    className="text-7xl font-black mb-4 text-transparent bg-clip-text 
                bg-gradient-to-r from-cyan-400 to-pink-400 animate-text-glow"
                  >
                    SMART TRAFFIC AI
                  </h1>
                  <div
                    className="h-1 bg-gradient-to-r from-cyan-400 to-pink-400 w-1/3 mx-auto 
                animate__animated animate__fadeInLeft"
                  />
                </motion.div>

                {/* Interactive Feature Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Features Panel */}
                  <motion.div
                    whileHover={{ rotateY: 5 }}
                    className="bg-black/40 p-8 rounded-2xl border-2 border-cyan-400/20 
                  hover:border-cyan-400/50 transition-all relative"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent 
                  opacity-30 animate-pulse"
                    />
                    <h2 className="text-3xl font-bold mb-6 text-cyan-400">
                      Features
                    </h2>
                    <ul className="space-y-4">
                      {[
                        "🚗 Smart Parking",
                        "🚥 Live Traffic",
                        "🟢 Adaptive Lights",
                        "🤖 AI Routing",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          whileHover={{ x: 15 }}
                          className="flex items-center space-x-4 text-lg p-4 
                        bg-black/30 rounded-xl hover:bg-cyan-400/10 border border-cyan-400/10
                        transition-all"
                        >
                          <span className="text-3xl animate-bounce">
                            {item.split(" ")[0]}
                          </span>
                          <span className="text-xl">
                            {item.split(" ").slice(1).join(" ")}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Use Cases Panel */}
                  <motion.div
                    whileHover={{ rotateY: -5 }}
                    className="bg-black/40 p-8 rounded-2xl border-2 border-pink-400/20 
                  hover:border-pink-400/50 transition-all relative"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-pink-400/10 to-transparent 
                  opacity-30 animate-pulse"
                    />
                    <h2 className="text-3xl font-bold mb-6 text-pink-400">
                      Use Cases
                    </h2>
                    <ul className="space-y-4">
                      {[
                        "City Control",
                        "Emergency Routes",
                        "Public Transport",
                        "Smart Parking",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-black/30 rounded-xl hover:bg-pink-400/10 
                        border border-pink-400/10 transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 flex items-center justify-center 
                          bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full text-xl
                          animate-pulse"
                            >
                              {i + 1}
                            </div>
                            <span className="text-xl">{item}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Cyberpunk-style Launch Button */}
                <motion.div
                  whileHover={{ scale: 1.1, translateX: "5vw" }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-12 flex justify-center"
                >
                  <Button
                    className="py-5 px-20 bg-gradient-to-r from-[#64ffda] to-[#f07178] 
             rounded-full text-2xl font-bold shadow-[0_4px_12px_rgba(100,255,218,0.5)] 
             hover:shadow-[0_8px_20px_rgba(100,255,218,0.8)] transition-all duration-300 
             border-2 border-white/40 relative overflow-hidden group"
                    onClick={handleSubmit}
                  >
                    {/* Button Text */}
                    <span className="relative z-10 animate-text-glow">
                      🚀 LAUNCH SYSTEM
                    </span>

                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />

                    {/* Border Glow Effect */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-border-glow" />
                  </Button>
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Holographic Road Visualization */}
          <div className="h-32 relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-lg border-2 border-cyan-400/20">
            <div className="absolute inset-0 flex items-center animate-holo-road">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-32 bg-gradient-to-r from-cyan-400 to-pink-400 mx-8 
              rounded-full transform -skew-x-12 shadow-xl"
                />
              ))}
            </div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 
          animate-holo-car"
            >
              <div
                className="w-full h-full bg-gradient-to-r from-cyan-400 to-pink-400 
            rounded-lg transform -skew-x-12 shadow-2xl blur-[1px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Home;
