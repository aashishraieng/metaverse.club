import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import a loader icon
import { doc, getDoc } from "firebase/firestore"; // Import getDoc
import { db } from "@/firebase/config";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate and useParams
import bgImage from "@/assets/event.webp"; // Your local image

// --- Firebase Function URLs (Replace with your actual deployed URLs) ---
const CREATE_ORDER_URL = "https://createrazorpayorder-uhizhde4ra-uc.a.run.app";
const VERIFY_PAYMENT_URL = "https://verifyrazorpaypaymentandsaveregistration-uhizhde4ra-uc.a.run.app";
const LOG_FAILED_PAYMENT_URL = "https://us-central1-metaverse-5c533.cloudfunctions.net/logFailedPayment";
// --- ---

export function RegistrationNow() {
  // Simulate getting eventId from URL params, e.g., /register-now/:eventId
  // For now, let's use a placeholder. Replace this with actual eventId logic.
  const { eventId: paramEventId } = useParams();
  const eventId = paramEventId || "event001"; // Fallback to a default/test eventId

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", // Changed from name
    registrationNumber: "", // Changed from reg_number
    email: "",
    department: "",
    contactNumber: "", // Changed from contact_number
  });

  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [errorEvent, setErrorEvent] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // No longer directly using firebaseStatus, payment status will be handled by navigation or alerts.

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setErrorEvent("Event ID is missing.");
        setLoadingEvent(false);
        return;
      }
      setLoadingEvent(true);
      setErrorEvent(null);
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const fetchedEventData = eventSnap.data();
          if (!fetchedEventData.isActive) {
            setErrorEvent("Registrations for this event are currently closed.");
            setEventData(null);
          } else {
            setEventData(fetchedEventData);
          }
        } else {
          setErrorEvent("Event not found.");
          setEventData(null);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setErrorEvent("Failed to load event details. Please try again.");
        setEventData(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData || errorEvent) {
      alert(errorEvent || "Event details not loaded or event is inactive. Cannot proceed with registration.");
      return;
    }
    setSubmitting(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay script. Please check your internet connection and try again.");
      setSubmitting(false);
      return;
    }

    try {
      // 1. Create Order with Firebase Function
      const orderResponse = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create Razorpay order.");
      }
      const orderDetails = await orderResponse.json();
      console.log("Order details received from backend:", orderDetails); // DEBUG

      if (typeof window.Razorpay !== 'function') {
        alert('Razorpay Checkout script did not load correctly or window.Razorpay is not a function. Please check console for errors related to checkout.js.');
        setSubmitting(false);
        return;
      }
      console.log("window.Razorpay is a function. Proceeding to instantiate."); // DEBUG

      // 2. Open Razorpay Checkout
      const options = {
        key: orderDetails.razorpayKeyId,
        amount: orderDetails.amount, // Ensure this is a number
        currency: orderDetails.currency,
        name: "Metaverse Club Event", // Replace with your actual club/org name
        description: `Registration for ${orderDetails.eventName}`,
        image: "/logo.png", // Ensure this path is correct in your public folder
        order_id: orderDetails.orderId,
        handler: async function (response) {
          // 3. Verify Payment with Firebase Function
          try {
            const verificationResponse = await fetch(VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                eventId: eventId,
                formData: formData, // Send collected form data
              }),
            });

            const verificationResult = await verificationResponse.json();

            if (verificationResult.status === "success") {
              setSubmitted(true);
              // Navigate to a success page with payment details
              navigate("/payment-success", {
                state: {
                  paymentId: verificationResult.paymentId,
                  orderId: verificationResult.orderId,
                  eventName: orderDetails.eventName,
                  registrationId: verificationResult.registrationId,
                },
              });
            } else {
              alert("Payment verification failed: " + (verificationResult.message || "Unknown error"));
            }
          } catch (verifyError) {
            console.error("Verification API error:", verifyError);
            alert("An error occurred during payment verification: " + verifyError.message);
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.contactNumber,
        },
        notes: {
          registration_number: formData.registrationNumber,
          department: formData.department,
          // You can add more notes if needed, e.g., eventId
          eventId: eventId,
        },
        theme: {
          color: "#4F46E5", // Example: Indigo color
        },
      };
      console.log("Options being passed to Razorpay Checkout:", options); // DEBUG

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) { // Made this async
        console.error("Razorpay Payment Failed Callback:", response);
        setSubmitting(false); // Allow user to try again sooner

        // Log the failed payment attempt
        try {
          await fetch(LOG_FAILED_PAYMENT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: eventId,
              formData: formData,
              error: response.error, // Full error object from Razorpay
              eventName: orderDetails.eventName, // Pass eventName if available
            }),
          });
          // Logging is best effort, don't block user flow if this fails
          console.log("Failed payment attempt logged.");
        } catch (logError) {
          console.error("Error logging failed payment:", logError);
        }
        
        // Navigate to payment failed page
        navigate("/payment-failed", {
          state: {
            error: response.error,
            orderId: response.error && response.error.metadata ? response.error.metadata.order_id : orderDetails.orderId,
            paymentId: response.error && response.error.metadata ? response.error.metadata.payment_id : null,
            eventName: orderDetails.eventName,
            eventId: eventId,
          },
        });
      });
      
      console.log("Calling rzp.open()..."); // DEBUG
      rzp.open();
      console.log("rzp.open() called."); // DEBUG
      // setSubmitting(false) is handled by Razorpay callbacks (handler or payment.failed)
      // to prevent premature UI update if user closes modal.
    } catch (err) {
      console.error("Error during registration submission:", err);
      alert("Error: " + err.message);
      setSubmitting(false);
    }
  };


  if (loadingEvent) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading event details...</p>
      </section>
    );
  }

  if (errorEvent) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-8 bg-red-800 bg-opacity-80 rounded-lg">
          <h2 className="text-2xl mb-4">Error</h2>
          <p>{errorEvent}</p>
          <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
        </div>
      </section>
    );
  }
  
  if (!eventData) { // Should be covered by errorEvent, but as a fallback
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Event not available or registration closed.</p>
         <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center px-8 py-20 bg-gray-900" // Darker background
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 bg-opacity-90 text-white rounded-3xl shadow-xl p-10 max-w-lg w-full"
        style={{
          // This pushes form slightly right of center
          marginLeft: "auto",
          marginRight: "15%",
        }}
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-100 mb-4">
          ✨ Register Now for {eventData?.eventName || "the Event"}!
        </h2>
        {/* Removed the separate "Submitting..." paragraph, will integrate into button */}
        {submitted && !submitting && (
          <p className="text-green-500 text-center font-semibold">
            🎉 Registration Successful!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* All input fields remain unchanged */}
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <motion.input
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registration Number
            </label>
            <motion.input
              name="registrationNumber"
              type="text"
              required
              value={formData.registrationNumber}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your registration number"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          {/* Email */}
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

          {/* Department */}
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

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Number
            </label>
            <motion.input
              name="contactNumber"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              style={{ color: "#111" }}
              className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your contact number"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileFocus={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
            />
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: submitting ? 1 : 1.1 }}
            whileTap={{ scale: submitting ? 1 : 0.95 }}
          >
            <Button
              type="submit"
              disabled={submitting || loadingEvent || !eventData}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-full shadow-md hover:ring-4 hover:ring-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Registration 🚀"
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
}
