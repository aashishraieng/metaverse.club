import { motion } from "framer-motion";
import "./Members.css";

const members = [
  { src: "/ashsish.jpg", title: "Ashish Rai", description: "CEO  (Chief executive officer)" },
  { src: "/abhay.jpg", title: "Abhay Majumdar", description: "Co-CEO" },
  { src: "/akshat.jpg", title: "Akshat Singh", description: "COO  (Chief Operating Officer)" },
  { src: "/charu.jpg", title: "Charu Verma", description: "Social Media Head" },
  { src: "/divyanshi.jpg", title: "Divyanshi Sharma", description: "HR (Human resources)" },
  { src: "/sumit.jpg", title: "Sumit Kumar", description: "Social Media Head" },
  { src: "/priyanchal.jpg", title: "Priyanchal Tripathi", description: "Social Media CO-Head and Content Writing Head" },
  { src: "/dheeraj.jpg", title: "Dheeraj", description: "Event Management CO-Head" },
  { src: "/aryan.jpg", title: "Aryan", description: "Event Management Head" },
  { src: "/aditya.jpg", title: "Aditya", description: "CDO  (Chief Design Officer)" },
];

function Member({ src, title, description, index }) {
  return (
    <motion.div
      className="member-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
    >
      <img src={src} alt={title} className="member-image" />
      <div className="member-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </motion.div>
  );
}

export default function Members() {
  return (
    <section className="members-section">
      <motion.h1
        className="section-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        🌟 Meet Our Members
      </motion.h1>
      <div className="members-grid">
        {members.map((member, index) => (
          <Member key={index} {...member} index={index} />
        ))}
      </div>
    </section>
  );
}
