import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import qrImage from "@/assets/qr.png"; // Update this path accordingly

export function RegistrationNow() {
  const [formData, setFormData] = useState({
    name: "",
    reg_number: "",
    email: "",
  });

  const [showQR, setShowQR] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file) {
    alert("Please upload your payment screenshot to confirm.");
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("reg_number", formData.reg_number);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("screenshot", file); // file upload

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/register", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Server Response:", data);
      setSubmitted(true);
      setFormData({ name: "", reg_number: "", email: "" });
      setShowQR(false);
      setPaymentConfirmed(false);
      setFile(null);
    } else {
      console.error("Error:", data);
      alert("Registration failed! " + data.detail || "Try again.");
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Something went wrong. Please try again.");
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

        {submitted && (
          <p className="text-green-500 text-center font-semibold">
            🎉 Registration Successful!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="mt-1 w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              whileHover={{ scale: 1.05 }}
              whileFocus={{ scale: 1.05 }}
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
              className="mt-1 w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your registration number"
              whileHover={{ scale: 1.05 }}
              whileFocus={{ scale: 1.05 }}
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
              className="mt-1 w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              whileHover={{ scale: 1.05 }}
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          {!showQR && !paymentConfirmed && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={() => setShowQR(true)}
                className="w-full bg-yellow-500 text-black py-3 px-6 rounded-full shadow-md hover:ring-4 hover:ring-yellow-400"
              >
                Pay Now 💸
              </Button>
            </motion.div>
          )}

          {showQR && !paymentConfirmed && (
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Scan the QR to Pay
              </h3>
              <img
                src={qrImage}
                alt="Payment QR Code"
                className="mx-auto w-64 rounded-lg border-2 border-white shadow-md"
              />
              <Button
                type="button"
                onClick={() => setPaymentConfirmed(true)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
              >
                I Have Paid ✅
              </Button>
            </div>
          )}

          {paymentConfirmed && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full text-gray-800"
                />
                {file && (
                  <p className="mt-2 text-green-400">
                    Selected file: {file.name}
                  </p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-full shadow-md hover:ring-4 hover:ring-indigo-600
                  ${!file ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!file}
                >
                  Submit Registration 🚀
                </Button>
              </motion.div>
            </>
          )}
        </form>
      </motion.div>
    </section>
  );
}
