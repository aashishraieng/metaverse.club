import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import heroImg from '../../assets/background.jpg';
import event1Img from '../../assets/event1.jpg';
import event2Img from '../../assets/event2.jpg';
import event3Img from '../../assets/event1.jpg';
import event4Img from '../../assets/event2.jpg';

const initialEvents = [
  {
    id: 1,
    image: event1Img,
    title: 'Hackathon 2025',
    text: 'A high-energy coding event for techies and developers.',
  },
  {
    id: 2,
    image: event2Img,
    title: 'Art Fiesta',
    text: 'Celebrate colors, creativity, and culture.',
  },
  {
    id: 3,
    image: event3Img,
    title: 'AI Workshop',
    text: 'Hands-on learning experience in machine learning and AI.',
  },
  {
    id: 4,
    image: event4Img,
    title: 'Poetry Night',
    text: 'A cozy night of poetic brilliance and performances.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const STORAGE_KEY = 'rsvpCounts';

const EventPage = () => {
  // Initialize state from localStorage or fallback to zeros
  const [rsvpCounts, setRsvpCounts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // If corrupted data, fallback to zero counts
      }
    }
    // default zero counts
    return initialEvents.reduce((acc, event) => {
      acc[event.id] = 0;
      return acc;
    }, {});
  });

  // Save to localStorage every time rsvpCounts changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvpCounts));
  }, [rsvpCounts]);

  const handleRSVP = (id, event) => {
    setRsvpCounts((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
    const rect = event.target.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 120,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });
  };

  return (
    <div className="bg-pink-200 text-blue-900 min-h-screen p-6 overflow-visible">
      {/* Hero Section */}
      <motion.section
        className="w-full bg-cover bg-center text-white text-center py-28 px-4 mb-12 rounded-3xl"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,0.7), rgba(0,0,0,0.7)), url(${heroImg})`,
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Events</h1>
        <p className="text-lg md:text-xl">Explore the amazing events we host regularly</p>
      </motion.section>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {initialEvents.map((event) => (
          <motion.div
            key={event.id}
            className="relative overflow-visible rounded-2xl shadow-lg cursor-pointer group flex flex-col"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 md:h-56 object-cover rounded-t-2xl transition-transform duration-500"
            />

            {/* Text Overlay (no bottom rounded corners) */}
            <motion.div
              initial={{ y: 0 }}
              className="bg-black/90 px-6 py-4 text-white flex-grow"
            >
              <h3 className="text-2xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm opacity-100">{event.text}</p>
            </motion.div>

            {/* RSVP Button */}
            <div className="bg-black/80 px-6 py-3 mt-2 flex justify-between items-center rounded-b-2xl">
              <button
                onClick={(e) => handleRSVP(event.id, e)}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-4 py-2 rounded shadow"
              >
                RSVP
              </button>
              <span className="text-white font-medium select-none">
                Attending: {rsvpCounts[event.id]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
