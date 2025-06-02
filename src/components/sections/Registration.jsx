import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase/config";

import VideoBg1 from "../../assets/regis1video.mp4";
import VideoBg2 from "../../assets/regis2video.mp4";
import VideoBg3 from "../../assets/regis3video.mp4";

export function Registration() {
  const navigate = useNavigate();
  const [activeEventId, setActiveEventId] = useState(null);
  const [loadingActiveEvent, setLoadingActiveEvent] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);

  const videoList = [VideoBg1, VideoBg2, VideoBg3];

  useEffect(() => {
    const fetchActiveEvent = async () => {
      setLoadingActiveEvent(true);
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("isActive", "==", true), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const activeEventDoc = querySnapshot.docs[0];
          setActiveEventId(activeEventDoc.id);
        } else {
          setActiveEventId(null);
        }
      } catch (error) {
        console.error("Error fetching active event:", error);
        setActiveEventId(null);
      } finally {
        setLoadingActiveEvent(false);
      }
    };

    fetchActiveEvent();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % videoList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [videoList.length]);

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

  return (
    <section className="relative py-28 px-4 text-center overflow-hidden">
      {/* Background Video */}
      <video
        key={videoIndex}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60 transition-opacity duration-1000"
        src={videoList[videoIndex]}
      />

      {/* Soft Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/25 z-10" />

      {/* Floating Bubbles */}
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          variants={floatVariants}
          animate="animate"
          className="absolute rounded-full opacity-20 blur-2xl"
          style={{
            width: `${30 + Math.random() * 50}px`,
            height: `${30 + Math.random() * 50}px`,
            backgroundColor: `hsl(210, 40%, 90%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 5,
          }}
        />
      ))}

      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-blue-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-5" />

      {/* Card Content */}
      <motion.div
        className="relative z-50 max-w-3xl mx-auto p-10 shadow-xl cloud-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ rotateX: 3, rotateY: -3 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-6">
          ☁️ Float into the Metaverse!
        </motion.h2>

        <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8">
          Connect with dreamers, builders, and visionaries.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Button
            onClick={() => {
              if (activeEventId) {
                navigate(`/register-now/${activeEventId}`);
              } else if (!loadingActiveEvent) {
                alert("There are currently no active events open for registration.");
              }
            }}
            disabled={loadingActiveEvent || !activeEventId}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingActiveEvent ? "Loading Event..." : "Register Now"}
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
          z-index: 50;
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
  );
}
