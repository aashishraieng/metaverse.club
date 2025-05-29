import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "../layout/Navbar";
import bgImage from "../../assets/background.jpg";
import aboutImage from "../../assets/aboutimage.jpg";

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
    <>
      {/* Hero Section */}
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{ color: "black" }} // text color globally
      >
        <div className="absolute top-0 left-0 w-full z-30">
          <Navbar />
        </div>

        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        />

        {/* Hero Text Content */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Translucent background box around text */}
          <div
            className="inline-block px-10 py-8 rounded-3xl mx-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.75)", // translucent white
              backdropFilter: "blur(8px)",
              maxWidth: "800px",
            }}
          >
            <motion.h1
              variants={itemVariants}
              className="text-7xl font-extrabold mb-6"
              style={{ color: "black" }}
            >
              Welcome to the Metaverse
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-2xl font-bold max-w-2xl mx-auto"
              style={{ color: "black" }}
            >
              A world of endless possibilities and limitless creativity. Join the
              revolution today!
            </motion.p>
          </div>
        </motion.div>

        {/* Floating Animated Circles */}
        <motion.div
          variants={heroBgVariants}
          animate="animate"
          className="absolute inset-0 flex justify-center items-center pointer-events-none"
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

      {/* About Us Section (overlapping hero) */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-stretch gap-10
                   relative -mt-28 z-40"
      >
        {/* Left Text Box */}
        <motion.div
          className="md:w-1/2 flex-1 p-8 rounded-xl shadow-2xl bg-purple-700 text-white cursor-pointer hover:scale-105 transition-transform duration-500 flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ minHeight: "350px" }}
        >
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg leading-relaxed flex-grow">
            The Metaverse is a digital universe full of endless possibilities,
            creativity, and immersive experiences. We are pioneers building
            the next frontier where technology, imagination, and human
            connection come together.
            <br />
            <br />
            Join us as we explore new realities, create innovative solutions,
            and shape the future of the digital world.
          </p>
        </motion.div>

        {/* Right Image Box */}
        <motion.div
          className="md:w-1/2 flex-1 p-6 rounded-xl shadow-2xl bg-indigo-700 cursor-pointer hover:scale-105 transition-transform duration-500 flex justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ minHeight: "350px" }}
        >
          <img
            src={aboutImage}
            alt="About Metaverse"
            className="rounded-lg shadow-lg max-w-full h-auto"
            style={{ maxHeight: "100%" }}
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="uppercase tracking-wide text-sm text-gray-500 mb-2">
            Prefix describing what your business does will be here
          </p>
          <h2 className="text-4xl font-bold mb-4">
            Headline Describing Your Company Core Values Will Come Here
          </h2>
        </div>

        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Core Value 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 text-4xl font-bold text-indigo-600">01</div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Core Value 1</h3>
              <p className="text-lg leading-relaxed">
                In this part, we will write about the core values and guiding principles that influence your business choices and operations.
              </p>
            </div>
          </div>

          {/* Core Value 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 text-4xl font-bold text-indigo-600">02</div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Core Value 2</h3>
              <p className="text-lg leading-relaxed">
                In this part, we will write about the core values and guiding principles that influence your business choices and operations.
              </p>
            </div>
          </div>

          {/* Core Value 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 text-4xl font-bold text-indigo-600">03</div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Core Value 3</h3>
              <p className="text-lg leading-relaxed">
                In this part, we will write about the core values and guiding principles that influence your business choices and operations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
