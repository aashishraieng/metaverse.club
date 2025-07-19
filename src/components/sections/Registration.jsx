import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Rocket, ShieldCheck, BadgeCheck } from "lucide-react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase/config";

const promises = [
  {
    icon: <Sparkles size={32} />,
    title: "Innovation",
    desc: "We bring cutting-edge tech to your learning journey.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Security",
    desc: "Your data and privacy are our top priority.",
  },
  {
    icon: <BadgeCheck size={32} />,
    title: "Trust",
    desc: "Built with love and trusted by students & teachers.",
  },
];

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

export function Registration() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const navigate = useNavigate();
  const [activeEventId, setActiveEventId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("isActive", "==", true), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setActiveEventId(snapshot.docs[0].id);
        } else {
          setActiveEventId(null);
        }
      } catch (error) {
        console.error("Failed to fetch active event:", error);
        setActiveEventId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveEvent();
  }, []);

  const handleRegisterClick = () => {
    if (activeEventId) {
      navigate(`/register-now/${activeEventId}`);
    } else if (!loading) {
      alert("No active event is currently available.");
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative bg-white overflow-hidden py-20 px-4 sm:px-12 lg:px-20"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 animate-gradient bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-blue-200 to-white blur-2xl opacity-60" />
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 animate-float z-0" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-blue-300 rounded-full opacity-30 animate-float-slow z-0" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 text-center max-w-4xl mx-auto space-y-10"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          <span className="text-purple-700">“</span> Empowering Education for
          the Future <span className="text-purple-700">”</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          className="text-gray-600 text-lg italic"
        >
          Join the movement of interactive learning and growth 🚀
        </motion.p>

        {/* Button */}
        <motion.button
          variants={scaleFade}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || !activeEventId}
          onClick={handleRegisterClick}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Register Now"}{" "}
          <Rocket size={20} className="animate-pulse" />
        </motion.button>

        {/* Badges */}
        <motion.div
          variants={containerVariants}
          className="flex justify-center mt-4 gap-6 text-sm text-gray-500"
        >
          {[
            { icon: <ShieldCheck size={16} />, label: "Secure" },
            { icon: <BadgeCheck size={16} />, label: "Future-ready" },
            { icon: <Sparkles size={16} />, label: "Trusted" },
          ].map((item, index) => (
            <motion.span
              key={index}
              variants={fadeInUp}
              className="flex items-center gap-1 transition-colors duration-300 hover:text-purple-700 cursor-default"
              whileHover={{ scale: 1.1 }}
            >
              {item.icon}
              {item.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14"
        >
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{
                rotate: [0, 2, -2, 1, -1, 0],
                transition: { duration: 0.4, repeat: Infinity },
              }}
              className="relative bg-white border border-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center space-y-3"
            >
              <motion.div
                whileHover={{ scale: 1.3, rotate: 10 }}
                className="text-purple-700 transition-transform duration-300"
              >
                {promise.icon}
              </motion.div>
              <h3 className="text-lg font-bold">{promise.title}</h3>
              <p className="text-gray-600 text-sm">{promise.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
