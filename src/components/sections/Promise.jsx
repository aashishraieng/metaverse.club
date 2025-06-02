import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Hand, Users, Star } from "lucide-react";
import Promisevideo from "../../assets/promise.mp4";

const Promise = () => {
  const promises = [
    "We respect your data and privacy.",
    "You’ll always have someone to connect with.",
    "No spam, only value.",
    "We build a community, not just an event."
  ];

  const promiseIcons = {
    0: <ShieldCheck size={40} />,
    1: <Hand size={40} />,
    2: <Users size={40} />,
    3: <Star size={40} />,
  };

  const [currentPromise, setCurrentPromise] = useState(0);

  const nextPromise = () => {
    setCurrentPromise((prev) => (prev + 1) % promises.length);
  };

  // Auto-slide every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextPromise();
    }, 2000);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={Promisevideo}
        type="video/mp4"
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" />

      {/* Text Box on Right */}
      <div className="relative z-20 h-full flex items-center justify-end px-6 md:px-12">
        <div className="bg-white bg-opacity-90 text-indigo-900 rounded-xl p-10 w-full max-w-md shadow-2xl min-h-[320px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-6">Promise from Us</h3>
            <motion.div
              key={currentPromise}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 text-lg font-medium min-h-[80px]"
            >
              {promiseIcons[currentPromise]}
              <span>{promises[currentPromise]}</span>
            </motion.div>
          </div>

          <button
            onClick={nextPromise}
            className="mt-6 self-end bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full transition"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Promise;
