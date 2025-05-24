import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function RegistrationNow() {
  const [formData, setFormData] = useState({
    name: "",
    reg_number: "",
    email: "",
    department: "",
    contact_number: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false); // New state for submission status

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Start submitting

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });


      const data = await response.json();

      if (response.ok) {
        console.log("Server Response:", data);
        setSubmitted(true);
        setFormData({
          name: "",
          reg_number: "",
          email: "",
          department: "",
          contact_number: "",
        });
      } else {
        console.error("Error:", data);
        alert("Registration failed! " + (data.detail || "Try again."));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false); // End submitting
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-gray-800 text-white rounded-3xl shadow-xl p-10 space-y-8 hover:ring-4 hover:ring-indigo-500"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-100 mb-4">
          ✨ Register Now for an Event!
        </h2>

        {submitting && (
          <p className="text-yellow-400 text-center font-semibold">
            ⏳ Submitting...
          </p>
        )}

        {submitted && !submitting && (
          <p className="text-green-500 text-center font-semibold">
            🎉 Registration Successful!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disable inputs and button while submitting */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <motion.input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registration Number
            </label>
            <motion.input
              name="reg_number"
              type="text"
              required
              value={formData.reg_number}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your registration number"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <motion.input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department
            </label>
            <motion.input
              name="department"
              type="text"
              required
              value={formData.department}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Your department"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Number
            </label>
            <motion.input
              name="contact_number"
              type="tel"
              required
              value={formData.contact_number}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your contact number"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          <motion.div
            whileHover={{ scale: submitting ? 1 : 1.1 }}
            whileTap={{ scale: submitting ? 1 : 0.95 }}
          >
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-full shadow-md hover:ring-4 hover:ring-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Registration 🚀"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
}
