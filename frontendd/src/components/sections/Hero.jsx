import React from "react";
import { motion } from "framer-motion";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.4 },
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

  const heroBgVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.6, 1],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className="relative py-36 text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 overflow-hidden"
      style={{ color: "white" }}
    >
      {/* Dynamic Background */}
      <motion.div
        variants={heroBgVariants}
        animate="animate"
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1600x900/0000FF/808080?text=Metaverse')",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Welcome to the Metaverse
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl mb-10"
        >
          A world of endless possibilities and limitless creativity. Join the revolution today!
        </motion.p>

       
      </motion.div>

      {/* Floating Animated Circles */}
      <motion.div
        variants={heroBgVariants}
        animate="animate"
        className="absolute inset-0 flex justify-center items-center"
      >
        <motion.div
          className="w-28 h-28 rounded-full bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 opacity-40"
          animate={{ y: [0, -40, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-30"
          animate={{ y: [0, 30, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}
