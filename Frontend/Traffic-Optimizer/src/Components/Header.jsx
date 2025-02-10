import React from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="w-full mx-auto relative z-50" style={{backgroundColor:"#0a192f"}}>
      <Navbar
        expand="lg"
        className="backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.3)] rounded-3xl hover:shadow-[0_15px_45px_rgba(255,255,255,0.5)] transition-all duration-300"
      >
        <Container fluid>
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: -2 }}
            className="flex items-center"
          >
            <Navbar.Brand
              as={Link}
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-white animate-text-shine"
            >
              Traffic-Optimizer AI
            </Navbar.Brand>
          </motion.div>

          <Navbar.Toggle
            aria-controls="navbarScroll"
            className="border-white text-white"
          />

          <Navbar.Collapse
            id="navbarScroll"
            className="py-4 lg:py-0 text-white "
          >
            <Nav className="me-auto my-2 my-lg-0 gap-3" navbarScroll>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Nav.Link
                  as={Link}
                  to="/"
                  className="text-white hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  Home
                </Nav.Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="text-white hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  Dashboard
                </Nav.Link>
              </motion.div>

              <motion.div whileHover={{ }} style={{backgroundColor:"#0a192f"}}>
                <NavDropdown
                  title={
                    <span className="text-white font-medium transition-all">
                      Solutions
                    </span>
                  }
                  className="rounded-xl px-4 py-2 text-white"
                  id="navbarScrollingDropdown"
                  
                >
                  <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/20 rounded-xl p-2 shadow-xl">
                    <NavDropdown.Item
                      as={Link}
                      to="/traffic-analysis"
                      className="text-white hover:bg-white/10 hover:text-cyan-300 rounded-lg p-3 transition-all group"
                    >
                      <span className="group-hover:translate-x-2 transition-transform">
                        🚦 Traffic Analysis
                      </span>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/ai-predictions"
                      className="text-white hover:bg-white/10 hover:text-pink-300 rounded-lg p-3 transition-all group"
                    >
                      <span className="group-hover:translate-x-2 transition-transform">
                        🤖 AI Predictions
                      </span>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/carpooling"
                      className="text-white hover:bg-white/10 hover:text-pink-300 rounded-lg p-3 transition-all group"
                    >
                      <span className="group-hover:translate-x-2 transition-transform">
                      🗺️ Car Pooling
                      </span>
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
              </motion.div>
            </Nav>

            <Form className="d-flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
                <Form.Control
                  type="search"
                  placeholder="Search city..."
                  className="me-2 bg-white/10 border-white/20 text-black placeholder-white/50 focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline-light"
                  className=" border-none text-black px-6 py-2 rounded-xl transition-all bg-white"
                >
                  Search
                </Button>
              </motion.div>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;