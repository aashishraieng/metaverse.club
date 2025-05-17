import React from "react";
import { motion } from "framer-motion";
// Update the path to Navbar.css
import "@/components/layout/Navbar.css";  


export function WelcomePage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600" >
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Metaverse Logo"
          className="logo h-40 w-auto mx-auto"
        />
        <motion.h1
          className="text-5xl font-extrabold text-white mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to Metaverse
        </motion.h1>
      </motion.div>
    </div>
  );
}
