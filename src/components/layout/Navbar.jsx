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

  // Animation variants for buttons
  const buttonVariant = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.3 },
    }),
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
        padding: "0 1rem",
      }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto flex items-center h-16 sm:px-6 px-4">
        {/* Logo on the left */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo"
            style={{ height: 50, width: "auto" }}
          />
        </div>

        {/* Centered buttons on desktop */}
        <div className="hidden sm:flex flex-grow justify-center gap-4">
          {isHome ? (
            [
              { label: "Members", path: "/members" },
              { label: "Event", path: "/Events" },
              { label: "Contact", path: "/contact" },
              { label: "Join", path: "/join-club" },
            ].map((item, i) => (
              <motion.div
                key={item.path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={buttonVariant}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
                >
                  {item.label}
                </Button>
              </motion.div>
            ))
          ) : (
            // If NOT home, hide these buttons, only show back button on mobile below
            <></>
          )}
        </div>

        {/* Back button on the right for non-home pages */}
        {!isHome && (
          <motion.div
            className="ml-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-800 hover:text-pink-600 transition-colors duration-300 flex items-center space-x-2"
              style={{ padding: "8px 16px" }}
            >
              <span style={{ fontSize: "1.5em" }}>←</span>
              <span>Back</span>
            </Button>
          </motion.div>
        )}

        {/* Hamburger menu on mobile only, shown only on home */}
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
            {[
              { label: "Members", path: "/members" },
              { label: "Contact", path: "/contact" },
              { label: "Join", path: "/join-club" },
            ].map((item, i) => (
              <motion.div
                key={item.path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={buttonVariant}
                className="w-3/4"
              >
                <Button
                  variant="ghost"
                  onClick={() => closeMenuAndNavigate(item.path)}
                  className="w-full text-center text-gray-800 hover:text-pink-600"
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
