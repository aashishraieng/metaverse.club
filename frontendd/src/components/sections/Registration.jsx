import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Registration() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const bubbles = Array.from({ length: 6 });

  return (
    <section
      className="relative py-24 text-center overflow-hidden bg-gradient-to-r from-indigo-200 to-indigo-50"
      style={{
        transition: "background 0.5s ease-in-out",
      }}
    >
      {/* Subtle Floating Bubbles with Shadow */}
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          variants={floatVariants}
          animate="animate"
          className="absolute rounded-full opacity-20 blur-2xl shadow-lg"
          style={{
            width: `${40 + Math.random() * 40}px`,
            height: `${40 + Math.random() * 40}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 30%, 85%)`,
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-gray-800 mb-6 shadow-md"
        >
          🌟 Ready to Join the Metaverse?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-700 mb-10"
        >
          Join a community of creators, artists, and innovators shaping the
          future. One event at a time.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Button
            onClick={() => navigate("/register-now")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-500 transition-all duration-300 ease-in-out"
          >
            Register Now
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
