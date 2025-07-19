import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Hand, Users, Star } from "lucide-react";

const promises = [
  {
    text: "Where innovation meets trust — we promise a seamless virtual experience.",
    icon: ShieldCheck,
    bg: "bg-pink-100",
  },
  {
    text: "A world beyond limits, built on your dreams and our commitment.",
    icon: Hand,
    bg: "bg-blue-100",
  },
  {
    text: "Our vision, our promise — together we shape tomorrow.",
    icon: Users,
    bg: "bg-green-100",
  },
  {
    text: "We don’t just open doors — we promise a world of possibilities.",
    icon: Star,
    bg: "bg-yellow-100",
  },
];

// Floating animation
const floatAnimation = {
  initial: { y: 0, rotate: -2 },
  animate: {
    y: [0, -4, 0, 4, 0],
    rotate: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Hover shake + pass to icon
const boxHover = {
  whileHover: {
    rotate: [0, 2, -2, 2, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const iconHover = {
  whileHover: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const boxVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
      type: "spring",
      stiffness: 80,
    },
  }),
};

const Promise = () => {
  return (
    <section className="w-full bg-white py-20 px-6 flex justify-center items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl w-full">
        {promises.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="relative flex flex-col items-center"
              variants={boxVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
            >
              {/* Pin Dot */}
              <div className="w-3 h-3 rounded-full bg-black absolute top-0 z-20 shadow-md" />

              {/* Card */}
              <motion.div
                className={`${item.bg} p-6 pt-8 rounded-xl shadow-2xl border border-black w-full text-center flex flex-col items-center justify-center gap-4 transition-transform`}
                variants={floatAnimation}
                initial="initial"
                animate="animate"
                {...boxHover}
              >
                {/* Icon with animation on hover */}
                <motion.div {...iconHover}>
                  <Icon size={40} className="text-indigo-700" />
                </motion.div>

                <p className="text-gray-800 text-base font-semibold">{item.text}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Promise;
