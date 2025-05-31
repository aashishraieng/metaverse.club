import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { motion } from "framer-motion";

export function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const paymentDetails = state || {}; // Fallback if state is not passed

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="text-6xl mb-6"
        >
          🎉
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Registration Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for registering for{" "}
          <strong>{paymentDetails.eventName || "the event"}</strong>. Your payment
          has been processed.
        </p>

        {paymentDetails.paymentId && (
          <div className="text-left bg-gray-50 bg-opacity-80 p-4 rounded-lg shadow mb-6 text-sm text-gray-700">
            <h2 className="font-semibold text-gray-800 mb-2 border-b pb-1">
              Payment Summary:
            </h2>
            <p>
              <strong>Payment ID:</strong> {paymentDetails.paymentId}
            </p>
            <p>
              <strong>Order ID:</strong> {paymentDetails.orderId}
            </p>
            {paymentDetails.registrationId && (
              <p>
                <strong>Registration ID:</strong> {paymentDetails.registrationId}
              </p>
            )}
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate("/")} // Navigate to homepage
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Go to Homepage
          </Button>
        </motion.div>
        <p className="mt-6 text-xs text-gray-600">
          You should receive a confirmation email shortly (if configured).
        </p>
      </motion.div>
    </section>
  );
}
