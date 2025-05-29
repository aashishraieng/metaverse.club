import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaLock, FaServer, FaHeadset, FaLightbulb, FaComments } from "react-icons/fa";

export function Registration() {
  const navigate = useNavigate();
  const [currentPromise, setCurrentPromise] = useState(0);

  const promises = [
    "We value your privacy and protect your data.",
    "Our platform guarantees 99.9% uptime.",
    "You get 24/7 customer support.",
    "We constantly innovate to serve you better.",
    "Your feedback drives our improvements.",
  ];

  const promiseIcons = [
    <FaLock className="text-indigo-600 w-12 h-12" />,
    <FaServer className="text-indigo-600 w-12 h-12" />,
    <FaHeadset className="text-indigo-600 w-12 h-12" />,
    <FaLightbulb className="text-indigo-600 w-12 h-12" />,
    <FaComments className="text-indigo-600 w-12 h-12" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromise((prev) => (prev + 1) % promises.length);
    }, 4000); // change every 4 seconds
    return () => clearInterval(interval);
  }, [promises.length]);

  const bubbles = Array.from({ length: 7 });

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

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

  function nextPromise() {
    setCurrentPromise((prev) => (prev + 1) % promises.length);
  }

  return (
    <>
      <section className="relative py-28 px-4 text-center overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Floating Bubbles */}
        {bubbles.map((_, i) => (
          <motion.div
            key={i}
            variants={floatVariants}
            animate="animate"
            className="absolute rounded-full opacity-30 blur-2xl"
            style={{
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              backgroundColor: `hsl(210, 40%, 90%)`, // soft pastel blue
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              zIndex: 0,
            }}
          />
        ))}

        {/* Glowing Cloud Background */}
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-blue-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-0" />

        {/* Cloud-shaped Card */}
        <motion.div
          className="relative z-10 max-w-3xl mx-auto p-10 shadow-xl cloud-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ rotateX: 3, rotateY: -3 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-gray-800 mb-6"
          >
            ☁️ Float into the Metaverse!
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8">
            Connect with dreamers, builders, and visionaries.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              onClick={() => navigate("/register-now")}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Register Now
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-sm italic text-gray-500 opacity-0"
          >
            “The future belongs to those who create it.”
          </motion.div>
        </motion.div>

        <style>{`
          .cloud-container {
            position: relative;
            background: linear-gradient(to bottom right, #e6f0fa, #f9fbfd);
            border-radius: 40px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
            z-index: 2;
          }

          .cloud-container::before,
          .cloud-container::after {
            content: '';
            position: absolute;
            background: linear-gradient(to bottom right, #e6f0fa, #f9fbfd);
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            z-index: -1;
          }

          .cloud-container::before {
            width: 100px;
            height: 100px;
            top: -45px;
            left: 50px;
            box-shadow:
              60px 20px 0 #d6e3f7,
              -60px 20px 0 #d6e3f7;
          }

          .cloud-container::after {
            width: 120px;
            height: 120px;
            top: -55px;
            right: 50px;
            box-shadow:
              40px 30px 0 #d6e3f7,
              -40px 30px 0 #d6e3f7;
          }
        `}</style>
      </section>
      <section className="py-16 px-8 bg-white max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left Box with Image */}
        <div className="md:w-1/2 flex justify-center" style={{ height: "480px" }}>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Promise Illustration"
            className="rounded-xl shadow-lg max-w-full h-full object-cover"
          />
        </div>

        {/* Right Box with Promises */}
        <div className="md:w-1/2 relative bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-12 shadow-lg flex flex-col justify-between" style={{ height: "480px" }}>
          <h3 className="text-3xl font-semibold text-indigo-700 mb-10">Promise from Us</h3>

          <motion.div
            key={currentPromise}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-indigo-900 flex-grow flex items-center gap-8 text-xl font-medium"
          >
            {promiseIcons[currentPromise]}
            <span>{promises[currentPromise]}</span>
          </motion.div>

          <button
            onClick={nextPromise}
            aria-label="Next Promise"
            className="absolute bottom-8 right-8 bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md hover:bg-indigo-700 transition text-3xl font-bold"
          >
            →
          </button>
        </div>
      </section>


    </>
  );
}
