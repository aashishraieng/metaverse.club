import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Hash, BookOpen, Mail } from "lucide-react";

export default function JoiningForm() {
  const [isValidPhoneNum, setIsValidPhoneNum] = useState(null);
  const [isValidRegNo, setIsValidRegNo] = useState(null);
  const [phoneNumText, setPhoneNum] = useState("");
  const [regnoText, setRegNo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRegInput = (e) => {
    const value = e.target.value.trim();
    setRegNo(value);
    setIsValidRegNo(value === "" ? null : /\d+$/.test(value));
  };

  const handlePhoneNumInp = (e) => {
    const value = e.target.value.trim();
    setPhoneNum(value);
    setIsValidPhoneNum(value === "" ? null : /^\d{10}$/.test(value));
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/v1/join-club`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = await res.json();

      if (res.ok && body.status === "success") {
        setIsSubmitted(true);
      } else {
        console.error("Error submitting form:", body);
        alert(body.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to submit form. Try again later.");
    }
  };

  const handleReset = () => {
    setPhoneNum("");
    setRegNo("");
    setIsValidPhoneNum(null);
    setIsValidRegNo(null);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 to-teal-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 border border-teal-200 transition-all duration-700 hover:shadow-teal-300">
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-teal-600 mb-4">
                🎉 Application Submitted!
              </h2>
              <p className="text-gray-700 text-lg">
                Thanks for joining MetaVerce. We'll contact you soon.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 transition-all duration-500">
                Join <span className="text-teal-600">MetaVerce</span> & Unlock Your Journey!
              </h2>
              <form className="space-y-6" onSubmit={handleJoinSubmit} onReset={handleReset}>
                {/* Full Name */}
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-teal-600" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-teal-600" /> Registration Number
                  </label>
                  <input
                    type="text"
                    name="reg_number"
                    value={regnoText}
                    onChange={handleRegInput}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                      isValidRegNo === null
                        ? "border-gray-300"
                        : isValidRegNo
                        ? "border-green-500 focus:ring-green-400"
                        : "border-red-500 focus:ring-red-400"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your registration number"
                    required
                  />
                  {isValidRegNo !== null && (
                    <p
                      className={`text-sm mt-1 ${
                        isValidRegNo ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isValidRegNo
                        ? "Looks good!"
                        : "Please enter a valid registration number."}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-teal-600" /> Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={phoneNumText}
                    onChange={handlePhoneNumInp}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                      isValidPhoneNum === null
                        ? "border-gray-300"
                        : isValidPhoneNum
                        ? "border-green-500 focus:ring-green-400"
                        : "border-red-500 focus:ring-red-400"
                    } focus:outline-none focus:ring-2`}
                    placeholder="0000000000"
                    required
                  />
                  {isValidPhoneNum !== null && (
                    <p
                      className={`text-sm mt-1 ${
                        isValidPhoneNum ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isValidPhoneNum
                        ? "Looks good!"
                        : "Please provide a valid 10-digit phone number."}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-600" /> Department / Stream
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    placeholder="e.g., CSE"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                    💬 Why do you want to join?
                  </label>
                  <textarea
                    name="reason"
                    rows="3"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    placeholder="Your motivation, interests, etc..."
                  />
                </div>

                {/* Submit & Reset */}
                <div className="pt-6 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
                  >
                    Submit Application
                  </motion.button>
                  <button
                    type="reset"
                    className="w-full text-teal-500 hover:underline text-sm font-medium"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
