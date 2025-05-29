import { motion } from "framer-motion";
import { useState } from "react";
import "./Contact.css";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import contactImage from "../../assets/contact1.avif"; // replace with your actual image name

export function Contact() {
  const CLUB_MAIL = "Metaverce.lpu@gmail.com";
  const [otherChoiceForJoin, setOtherChoice] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formdata = Object.fromEntries(new FormData(e.target).entries());

    try {
      await addDoc(collection(db, "contacts"), {
        ...formdata,
        timestamp: serverTimestamp(),
      });

      setSubmitted(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("❌ Failed to send message. Please try again.");
      console.error("Firebase error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const JoinAsOptions = ["Volunteer", "Social Media", "Event Team", "Content Creator", "Technical"];

  return (
    <section className="contact-section">
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="left-box">
          <img src={contactImage} alt="Contact Us" />
        </div>

        <div className="right-box">
          {submitted ? (
            <div className="success-message">
              ✅ Your message has been sent successfully! <br />
              We'll reach out to you on your email or phone number soon.
            </div>
          ) : (
            <>
              <h2 className="form-title">Get in Touch</h2>
              <form onSubmit={handleContactSubmit} className="form-grid">
                <div className="input-group">
                  <label htmlFor="fname">First Name</label>
                  <input type="text" name="fname" id="fname" placeholder="Enter first name..." required />
                </div>
                <div className="input-group">
                  <label htmlFor="lname">Last Name</label>
                  <input type="text" name="lname" id="lname" placeholder="Enter last name..." required />
                </div>
                <div className="input-group full">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="input-group full">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="text" id="phone" name="phone_number" placeholder="+91 xxx-xxx-xxxx" required />
                </div>
                <div className="input-group full">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Leave us a message..." rows="4" required />
                </div>
                <div className="input-group full">
                  <label>Services</label>
                  <div className="checkbox-grid">
                    {JoinAsOptions.map((item, index) => (
                      <label key={index}>
                        <input type="radio" value={item} name="servicechoice" disabled={otherChoiceForJoin} /> {item}
                      </label>
                    ))}
                    <label>
                      <input
                        type="checkbox"
                        value="Other"
                        checked={otherChoiceForJoin}
                        onChange={() => setOtherChoice(!otherChoiceForJoin)}
                      />
                      Other
                    </label>
                  </div>
                </div>
                {otherChoiceForJoin && (
                  <div className="input-group full">
                    <label htmlFor="other">Enter Other Choice</label>
                    <input type="text" name="servicechoice" id="other" placeholder="Enter your role..." required />
                  </div>
                )}
                <div className="submit-wrap full">
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
              </form>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
