import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenuAndNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </div>

          {/* Hamburger */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
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

          {/* Desktop Nav */}
          <div className="hidden sm:flex space-x-4 ml-auto">
            {currentPath !== "/" ? (
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
              >
                <p style={{ fontSize: "2em" }}>&larr;</p> Back
              </Button>
            ) : (
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
            )}
          </div>
        </div>

        {/* Mobile Dropdown with animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-md z-40 py-4 space-y-2 flex flex-col items-center sm:hidden shadow-md"
            >
              {currentPath !== "/" ? (
                <Button
                  variant="ghost"
                  onClick={() => closeMenuAndNavigate("/")}
                  className="w-3/4 text-center text-gray-800 hover:text-pink-600"
                >
                  <p style={{ fontSize: "1.5em" }}>&larr;</p> Back
                </Button>
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
