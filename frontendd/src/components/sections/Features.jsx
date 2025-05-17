import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Mail } from "lucide-react";

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.3,
      rotate: 360,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">What We Offer</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Explore the core features of Metaverse and get involved with our dynamic, passionate community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature Card 1 */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transition"
          >
            <motion.div variants={iconVariants} whileHover="hover">
              <Calendar className="h-12 w-12 mx-auto mb-5 text-pink-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-3">Regular Events</h3>
            <p className="text-gray-300">
              Join our exciting lineup of events and showcase your talents all year round.
            </p>
          </motion.div>

          {/* Feature Card 2 */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transition"
          >
            <motion.div variants={iconVariants} whileHover="hover">
              <Users className="h-12 w-12 mx-auto mb-5 text-pink-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-3">Community</h3>
            <p className="text-gray-300">
              Be a part of a welcoming and vibrant community that shares your interests.
            </p>
          </motion.div>

          {/* Feature Card 3 */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transition"
          >
            <motion.div variants={iconVariants} whileHover="hover">
              <Mail className="h-12 w-12 mx-auto mb-5 text-pink-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-3">Stay Updated</h3>
            <p className="text-gray-300">
              Never miss an update! Stay informed on our latest news and announcements.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
