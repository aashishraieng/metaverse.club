import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import "./Navbar.css";

// Remove the import from .env

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isHome = currentPath === "/";

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenuAndNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const buttonVariant = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.3 },
    }),
  };

  const [activeEvent, setActiveEvent] = useState(null);
  const [loadingActiveEvent, setLoadingActiveEvent] = useState(true);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      setLoadingActiveEvent(true);
      try {
        const eventsRef = collection(db, "events");
        // Query for a single active event without filtering by type
        const q = query(
          eventsRef,
          where("isActive", "==", true),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const activeEventDoc = querySnapshot.docs[0];
          // FIX: Correctly store the document ID with the event data
          setActiveEvent({ id: activeEventDoc.id, ...activeEventDoc.data() });
        } else {
          setActiveEvent(null);
        }
      } catch (error) {
        console.error("Error fetching active event:", error);
        setActiveEvent(null);
      } finally {
        setLoadingActiveEvent(false);
      }
    };

    fetchActiveEvent();
  }, []);

  const handleRegisterClick = () => {
    if (loadingActiveEvent) return;

    if (!activeEvent) {
      alert("Registration is currently not active. Please try again later.");
      return;
    }

    let path;
    switch (activeEvent.eventType) {
      case "HACKATHON":
        path = `/hackathon-register/${activeEvent.id}`;
        break;
      case "INDIVIDUAL":
        path = `/register-now/${activeEvent.id}`;
        break;
      default:
        alert("Registration is currently closed.");
        return;
    }
    navigate(path);
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
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo"
            style={{ height: 50, width: "auto" }}
          />
        </div>

        {/* Centered nav links (only on home) */}
        <div className="hidden sm:flex flex-grow justify-center gap-4">
          {isHome &&
            [
              { label: "Members", path: "/members" },
              { label: "Event", path: "/events" },
              { label: "Contact", path: "/contact" },
              { label: "Join Club", path: "/join-club" },
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
                  className="text-gray-800 hover:text-pink-600"
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
        </div>

        {/* Right side: Back & Register Now */}
        <div className="ml-auto flex items-center gap-3 sm:flex hidden">

          {!isHome && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="back-button"
              >
                <span style={{ fontSize: "1.5em" }}>←</span>
                <span>Back</span>
              </Button>
            </motion.div>
          )}

          {/* Registration Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loadingActiveEvent ? (
              <Button disabled className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md cursor-not-allowed">
                Loading Event...
              </Button>
            ) : !activeEvent ? (
              <Button disabled className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md cursor-not-allowed">
                Coming Soon
              </Button>
            ) : (
              <Button
                onClick={handleRegisterClick}
                disabled={!activeEvent}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
              >
                Register Now
              </Button>
            )}
          </motion.div>
        </div>

        {/* Hamburger menu toggle (only on home) */}
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

      {/* Mobile dropdown */}
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

            {/* Registration Button (mobile) */}
            {loadingActiveEvent ? (
              <Button disabled className="w-3/4 px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md cursor-not-allowed">
                Loading...
              </Button>
            ) : !activeEvent ? (
              <Button disabled className="w-3/4 px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md cursor-not-allowed">
                Coming Soon
              </Button>
            ) : (
              <Button
                onClick={handleRegisterClick}
                disabled={!activeEvent}
                className="w-3/4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
              >
                Register Now
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}