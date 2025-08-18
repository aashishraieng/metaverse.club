/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const Razorpay = require("razorpay");
const cors = require("cors")({origin: true});

admin.initializeApp();
const db = admin.firestore();

/**
 * Creates a Razorpay order for a given event.
 * Handles both fixed-price individual and variable-price hackathon registrations.
 */
exports.createRazorpayOrder = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }

    // MODIFICATION START: Get both eventId and the optional amount
    const {eventId, amount} = request.body;
    // MODIFICATION END

    if (!eventId) {
      logger.error("Event ID is missing from the request body.");
      return response.status(400).json({error: "Event ID is required."});
    }

    logger.info(`Creating Razorpay order for eventId: ${eventId}`);

    try {
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const razorpayKeySecret = process.env.RAZORPAY_SECRET;

      if (!razorpayKeyId || !razorpayKeySecret) {
        logger.error("Razorpay API keys are not configured.");
        return response.status(500).json({error: "Razorpay API keys not configured."});
      }

      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        logger.error(`Event with ID: ${eventId} not found.`);
        return response.status(404).json({error: "Event not found."});
      }

      const eventData = eventDoc.data();

      // MODIFICATION START: Conditional logic for amount
      let finalAmount = 0;
      if (amount && typeof amount === "number" && amount > 0) {
        // Use the amount from the request body (for hackathons)
        finalAmount = amount;
        logger.info(`Using custom amount from request body: ${finalAmount}`);
      } else {
        // Use the registration fee from Firestore (for individuals)
        finalAmount = eventData.registrationFee;
        logger.info(`Using fee from Firestore document: ${finalAmount}`);
      }
      // MODIFICATION END

      const currency = eventData.currency || "INR";

      if (!finalAmount || typeof finalAmount !== "number" || finalAmount <= 0) {
        logger.error(`Invalid final amount for event ID: ${eventId}. Amount: ${finalAmount}`);
        return response.status(400).json({error: "Invalid or missing registration fee."});
      }
      if (!eventData.isActive) {
        logger.warn(`Attempt to register for inactive event ID: ${eventId}`);
        return response.status(400).json({error: "Registrations for this event are currently closed."});
      }

      const rzpInstance = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      });

      const orderOptions = {
        amount: finalAmount, // Use the determined final amount
        currency: currency,
        receipt: `rcpt_${eventId}_${Date.now()}`,
        payment_capture: 1,
        notes: {
          eventId: eventId,
          eventName: eventData.eventName || "N/A",
        },
      };

      logger.info("Creating order with Razorpay with options:", orderOptions);
      const order = await rzpInstance.orders.create(orderOptions);
      logger.info("Razorpay order created successfully:", order);

      return response.status(200).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKeyId: razorpayKeyId,
        eventName: eventData.eventName || "N/A",
      });
    } catch (error) {
      logger.error("Error creating Razorpay order:", error);
      const errorMessage = error.error?.description || error.message || "Failed to create Razorpay order.";
      return response.status(500).json({error: errorMessage, details: error});
    }
  });
});


/**
 * Verifies a Razorpay payment and saves individual or team registration data.
 */
exports.verifyRazorpayPaymentAndSaveRegistration = functions.https.onRequest(
  (request, response) => {
    cors(request, response, async () => {
      if (request.method !== "POST") {
        return response.status(405).send("Method Not Allowed");
      }

      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        eventId,
        formData,
      } = request.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !eventId || !formData) {
        logger.error("Missing required fields for payment verification.", request.body);
        return response.status(400).json({error: "Missing required fields."});
      }

      logger.info(`Verifying payment for orderId: ${razorpay_order_id}`);

      try {
        const razorpayKeySecret = process.env.RAZORPAY_SECRET;
        if (!razorpayKeySecret) {
          logger.error("Razorpay API secret is not configured.");
          return response.status(500).json({error: "Razorpay API secret not configured."});
        }

        const crypto = require("crypto");
        const bodyToVerify = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", razorpayKeySecret)
          .update(bodyToVerify.toString())
          .digest("hex");

        if (expectedSignature === razorpay_signature) {
          logger.info("Payment verification successful.");

          const eventDoc = await db.collection("events").doc(eventId).get();
          const eventName = eventDoc.exists ? eventDoc.data().eventName : "N/A";
          
          // MODIFICATION START: Spread formData to include all fields (team or individual)
          const registrationData = {
            ...formData, // This will include all fields from the form
            eventId: eventId,
            eventName: eventName,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            paymentStatus: "SUCCESSFUL",
            registrationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          };
          // MODIFICATION END

          const registrationRef = await db.collection("registrations").add(registrationData);
          logger.info(`Registration data saved with ID: ${registrationRef.id}`, registrationData);

          return response.status(200).json({
            status: "success",
            message: "Payment verified and registration successful.",
            registrationId: registrationRef.id,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
          });
        } else {
          logger.error("Payment verification failed. Signature mismatch.");
          return response.status(400).json({status: "failure", message: "Payment verification failed."});
        }
      } catch (error) {
        logger.error("Error during payment verification:", error);
        return response.status(500).json({error: "Internal server error.", details: error.message});
      }
    });
  },
);