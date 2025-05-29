import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isHome = currentPath === "/";

  useEffect(() => {
    console.log("Current Path:", currentPath);
  }, [currentPath]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenuAndNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 20,
      }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>

        {/* Centered buttons */}
        <div className="flex-grow flex justify-center space-x-4">
          {isHome ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/members")}
                className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
              >
                Members
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/Events")}
                className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
              >
                Event
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/contact")}
                className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
              >
                Contact
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/join-club")}
                className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
              >
                Join
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-800 hover:text-pink-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <span style={{ fontSize: "1.5em" }}>←</span>
              <span>Back</span>
            </Button>
          )}
        </div>

        {/* Hamburger menu on mobile only */}
        {isHome && (
          <div className="sm:hidden absolute right-4">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-md z-40 py-4 space-y-2 flex flex-col items-center sm:hidden shadow-md"
          >
            <Button
              variant="ghost"
              onClick={() => closeMenuAndNavigate("/members")}
              className="w-3/4 text-center text-gray-800 hover:text-pink-600"
            >
              Members
            </Button>
            <Button
              variant="ghost"
              onClick={() => closeMenuAndNavigate("/contact")}
              className="w-3/4 text-center text-gray-800 hover:text-pink-600"
            >
              Contact
            </Button>
            <Button
              variant="ghost"
              onClick={() => closeMenuAndNavigate("/join-club")}
              className="w-3/4 text-center text-gray-800 hover:text-pink-600"
            >
              Join
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
