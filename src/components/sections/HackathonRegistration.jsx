import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from "@/assets/event.webp";

// --- Configuration ---
const PER_PERSON_COST = 1; // Set your per-person cost here in rupees
const CURRENCY = "INR";
// --- Firebase Function URLs ---
const CREATE_ORDER_URL = "https://createrazorpayorder-uhizhde4ra-uc.a.run.app";
const VERIFY_PAYMENT_URL = "https://verifyrazorpaypaymentandsaveregistration-uhizhde4ra-uc.a.run.app";
const LOG_FAILED_PAYMENT_URL = "https://us-central1-metaverse-5c533.cloudfunctions.net/logFailedPayment";
// --- ---

export function HackathonRegistration() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(2);
  const [members, setMembers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [errorEvent, setErrorEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize members array based on team size
  useEffect(() => {
    const initialMembers = Array.from({ length: teamSize }, () => ({
      fullName: "",
      registrationNumber: "",
      email: "",
      department: "",
      contactNumber: "",
    }));
    setMembers(initialMembers);
    setTotalAmount(teamSize * PER_PERSON_COST * 100); // Amount in paise
  }, [teamSize]);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setErrorEvent("Event ID is missing.");
        setLoadingEvent(false);
        return;
      }
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists() && eventSnap.data().isActive) {
          setEventData(eventSnap.data());
        } else {
          setErrorEvent("This event is not active or cannot be found.");
        }
      } catch (err) {
        setErrorEvent("Failed to load event details.");
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const handleMemberChange = (index, e) => {
    const updatedMembers = [...members];
    updatedMembers[index][e.target.name] = e.target.value;
    setMembers(updatedMembers);
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData) {
      alert("Event details not loaded. Cannot proceed.");
      return;
    }
    setSubmitting(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay script. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      const orderResponse = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOTE: We send the *calculated* amount to the backend
        body: JSON.stringify({ eventId, amount: totalAmount }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create Razorpay order.");
      }
      const orderDetails = await orderResponse.json();

      const options = {
        key: orderDetails.razorpayKeyId,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: "Metaverse Hackathon",
        description: `Registration for ${teamName}`,
        image: "/logo.png",
        order_id: orderDetails.orderId,
        handler: async function (response) {
          try {
            const verificationResponse = await fetch(VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                eventId,
                //formData now includes both individual and team details
                formData: {
                  // Add the fields the function is expecting, using the first member's details
                  fullName: members[0].fullName,
                  registrationNumber: members[0].registrationNumber,
                  email: members[0].email,
                  contactNumber: members[0].contactNumber,
                  department: members[0].department,
                  // Also include the team-specific data to be saved
                  teamName: teamName,
                  teamSize: teamSize,
                  members: members,
                },
              }),
            });
            const result = await verificationResponse.json();
            if (result.status === "success") {
              navigate("/payment-success", { state: { ...result, eventName: orderDetails.eventName } });
            } else {
              alert(`Payment verification failed: ${result.message}`);
            }
          } catch (err) {
            alert(`An error occurred during verification: ${err.message}`);
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: members[0].fullName,
          email: members[0].email,
          contact: members[0].contactNumber,
        },
        notes: {
          teamName: teamName,
          teamSize: teamSize,
          eventId: eventId,
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) {
        console.error("Payment Failed:", response.error);
        // Log failed payment
        try {
          await fetch(LOG_FAILED_PAYMENT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId,
              formData: { teamName, teamSize, members },
              error: response.error,
              eventName: orderDetails.eventName,
            }),
          });
        } catch (logError) {
          console.error("Failed to log payment error:", logError);
        }
        navigate("/payment-failed", { state: { error: response.error, orderId: orderDetails.orderId, eventName: orderDetails.eventName, eventId } });
      });
      rzp.open();
    } catch (err) {
      alert(`Error: ${err.message}`);
      setSubmitting(false);
    }
  };

  if (loadingEvent) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>Loading event...</p></div>;
  if (errorEvent) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p className="text-red-500">{errorEvent}</p></div>;

  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-20 bg-gray-900" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gray-800 bg-opacity-90 text-white rounded-3xl shadow-xl p-10 max-w-4xl w-full">
        <h2 className="text-3xl font-extrabold text-center text-gray-100 mb-6">
          Hackathon Registration for {eventData?.eventName || "the Event"}!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
              <input name="teamName" type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ color: "#111" }} className="w-full px-5 py-3 border border-gray-500 rounded-lg" placeholder="Enter your team name" disabled={submitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
              <select name="teamSize" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} style={{ color: "#111" }} className="w-full px-5 py-3 border border-gray-500 rounded-lg" disabled={submitting}>
                <option value={2}>2 Members</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members</option>
              </select>
            </div>
          </div>

          {/* Member Details */}
          <div className="space-y-8">
            {members.map((member, index) => (
              <div key={index} className="p-4 border border-gray-600 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">Member {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="fullName" type="text" required value={member.fullName} onChange={(e) => handleMemberChange(index, e)} style={{ color: "#111" }} className="w-full px-4 py-2 border border-gray-500 rounded-md" placeholder="Full Name" disabled={submitting} />
                  <input name="registrationNumber" type="text" required value={member.registrationNumber} onChange={(e) => handleMemberChange(index, e)} style={{ color: "#111" }} className="w-full px-4 py-2 border border-gray-500 rounded-md" placeholder="Registration Number" disabled={submitting} />
                  <input name="email" type="email" required value={member.email} onChange={(e) => handleMemberChange(index, e)} style={{ color: "#111" }} className="w-full px-4 py-2 border border-gray-500 rounded-md" placeholder="Email Address" disabled={submitting} />
                  <input name="department" type="text" required value={member.department} onChange={(e) => handleMemberChange(index, e)} style={{ color: "#111" }} className="w-full px-4 py-2 border border-gray-500 rounded-md" placeholder="Department" disabled={submitting} />
                  <input name="contactNumber" type="tel" required value={member.contactNumber} onChange={(e) => handleMemberChange(index, e)} style={{ color: "#111" }} className="w-full px-4 py-2 border border-gray-500 rounded-md" placeholder="Contact Number" disabled={submitting} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Total and Submit */}
          <div className="text-center pt-4">
             <p className="text-2xl font-bold mb-4">Total: ₹{totalAmount / 100}</p>
             <Button type="submit" disabled={submitting || loadingEvent} className="w-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-full shadow-md hover:ring-4 hover:ring-indigo-600 disabled:opacity-60">
              {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : `Pay and Register 🚀`}
            </Button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}