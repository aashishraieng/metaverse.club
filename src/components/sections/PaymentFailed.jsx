import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { motion } from "framer-motion";

export function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const errorDetails = state || {}; // Fallback if state is not passed

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 text-white p-8">
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
          😞
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Payment Failed
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Unfortunately, we were unable to process your payment for{" "}
          <strong>{errorDetails.eventName || "the event"}</strong>.
        </p>

        {errorDetails.error && (
          <div className="text-left bg-red-100 bg-opacity-80 p-4 rounded-lg shadow mb-6 text-sm text-red-700">
            <h2 className="font-semibold text-red-800 mb-2 border-b border-red-300 pb-1">
              Error Details:
            </h2>
            {errorDetails.error.description && <p><strong>Description:</strong> {errorDetails.error.description}</p>}
            {errorDetails.error.reason && <p><strong>Reason:</strong> {errorDetails.error.reason}</p>}
            {errorDetails.error.code && <p><strong>Code:</strong> {errorDetails.error.code}</p>}
            {errorDetails.orderId && <p><strong>Order ID:</strong> {errorDetails.orderId}</p>}
            {errorDetails.paymentId && <p><strong>Payment ID:</strong> {errorDetails.paymentId}</p>}
          </div>
        )}
        
        <p className="text-gray-600 mb-6 text-sm">
          Please try again or contact support if the issue persists.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-4"
        >
          <Button
            onClick={() => navigate(`/register-now/${errorDetails.eventId || ""}`)} // Navigate back to registration form
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Try Again
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate("/")} // Navigate to homepage
            variant="outline"
            className="w-full border-gray-600 text-gray-700 hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Go to Homepage
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
