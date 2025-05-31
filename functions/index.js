/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
const functions = require("firebase-functions"); // Reverting to v1 for simplicity, will keep process.env
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const Razorpay = require("razorpay");
const cors = require("cors")({origin: true}); // To handle CORS

admin.initializeApp();
const db = admin.firestore();

/**
 * Creates a Razorpay order for a given event.
 * Expects a POST request with JSON body: {eventId: "your_event_id"}
 */
exports.createRazorpayOrder = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }

    const {eventId} = request.body;

    if (!eventId) {
      logger.error("Event ID is missing from the request body.");
      return response.status(400).json({error: "Event ID is required."});
    }

    logger.info(`Creating Razorpay order for eventId: ${eventId}`);

    try {
      // For 2nd Gen functions, access config via process.env
      // The Firebase CLI typically makes `group.name` available as `GROUP_NAME`
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const razorpayKeySecret = process.env.RAZORPAY_SECRET;

      if (!razorpayKeyId || !razorpayKeySecret) {
        logger.error(
            "Razorpay API keys are not configured in Firebase functions environment.",
        );
        return response.status(500)
            .json({error: "Razorpay API keys not configured."});
      }

      // Fetch event details from Firestore
      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        logger.error(`Event with ID: ${eventId} not found in Firestore.`);
        return response.status(404).json({error: "Event not found."});
      }

      const eventData = eventDoc.data();
      const registrationFee = eventData.registrationFee;
      const currency = eventData.currency || "INR";

      if (!registrationFee ||
            typeof registrationFee !== "number" ||
            registrationFee <= 0) {
        logger.error(
            `Invalid registration fee for event ID: ${eventId}. Fee: ${registrationFee}`,
        );
        return response.status(400).json(
            {error: "Invalid or missing registration fee for the event."},
        );
      }
      if (!eventData.isActive) {
        logger.warn(`Attempt to register for inactive event ID: ${eventId}`);
        return response.status(400)
            .json({error: "Registrations for this event are currently closed."});
      }

      const rzpInstance = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      });

      const orderOptions = {
        amount: registrationFee,
        currency: currency,
        receipt: `rcpt_${eventId}_${Date.now()}`,
        payment_capture: 1, // Auto capture payment
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
      let errorMessage = "Failed to create Razorpay order.";
      if (error.error && error.error.description) {
        errorMessage = error.error.description;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return response.status(500)
          .json({error: errorMessage, details: error});
    }
  });
});

// Example of how to structure the "events" collection in Firestore:
// Document ID: someEventId123
// Fields:
//   eventName: "Annual Tech Conference"
//   registrationFee: 50000 (for ₹500.00)
//   currency: "INR"
//   isActive: true
//   description: "Join us for the biggest tech event of the year!"
//   eventDate: Firestore Timestamp

/**
 * Verifies a Razorpay payment signature and saves registration data to Firestore.
 * Expects a POST request with JSON body:
 * {
 *   razorpay_payment_id: "...",
 *   razorpay_order_id: "...",
 *   razorpay_signature: "...",
 *   eventId: "...",
 *   formData: {
 *     fullName: "...",
 *     registrationNumber: "...",
 *     email: "...",
 *     department: "...",
 *     contactNumber: "..."
 *   }
 * }
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

        if (!razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !eventId ||
            !formData) {
          logger.error(
              "Missing required fields for payment verification.", request.body,
          );
          return response.status(400)
              .json({error: "Missing required fields for payment verification."});
        }

        const requiredFormFields = [
          "fullName",
          "registrationNumber",
          "email",
          "department",
          "contactNumber",
        ];
        for (const field of requiredFormFields) {
          if (!formData[field]) {
            logger.error(`Missing form data field: ${field}`, formData);
            return response.status(400)
                .json({error: `Missing required form data: ${field}`});
          }
        }

        logger.info(
            `Verifying payment for orderId: ${razorpay_order_id}, paymentId: ${razorpay_payment_id}`,
        );

        try {
          // For 2nd Gen functions, access config via process.env
          const razorpayKeySecret = process.env.RAZORPAY_SECRET;
          if (!razorpayKeySecret) {
            logger.error(
                "Razorpay API secret is not configured in Firebase functions environment.",
            );
            return response.status(500)
                .json({error: "Razorpay API secret not configured."});
          }

          const crypto = require("crypto");
          const bodyToVerify = razorpay_order_id + "|" + razorpay_payment_id;
          const expectedSignature = crypto
              .createHmac("sha256", razorpayKeySecret)
              .update(bodyToVerify.toString())
              .digest("hex");

          if (expectedSignature === razorpay_signature) {
            logger.info("Payment verification successful.");

            const eventRef = db.collection("events").doc(eventId);
            const eventDoc = await eventRef.get();
            let eventName = "N/A";
            let amountPaid = 0;
            let currency = "INR";

            if (eventDoc.exists) {
              const eventData = eventDoc.data();
              eventName = eventData.eventName || "N/A";
              amountPaid = eventData.registrationFee;
              currency = eventData.currency || "INR";
            } else {
              logger.warn(
                  `Event ${eventId} not found during verification, but proceeding with registration.`,
              );
            }

            const registrationData = {
              eventId: eventId,
              eventName: eventName,
              fullName: formData.fullName,
              registrationNumber: formData.registrationNumber,
              email: formData.email,
              department: formData.department,
              contactNumber: formData.contactNumber,
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              paymentSignature: razorpay_signature,
              paymentStatus: "SUCCESSFUL",
              amountPaid: amountPaid,
              currency: currency,
              registrationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            };

            const registrationRef = await db.collection("registrations")
                .add(registrationData);
            logger.info(
                `Registration data saved with ID: ${registrationRef.id}`,
                registrationData,
            );

            return response.status(200).json({
              status: "success",
              message: "Payment verified and registration successful.",
              registrationId: registrationRef.id,
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
            });
          } else {
            logger.error("Payment verification failed. Signature mismatch.");
            return response.status(400).json(
                {status: "failure", message: "Payment verification failed. Signature mismatch."},
            );
          }
        } catch (error) {
          logger.error(
              "Error during payment verification or saving registration:", error,
          );
          return response.status(500).json(
              {error: "Internal server error during payment verification.", details: error.message},
          );
        }
      });
    },
);

/**
 * Logs a failed payment attempt to Firestore.
 * Expects a POST request with JSON body:
 * {
 *   eventId: "...",
 *   formData: { ... }, // Same as successful registration
 *   error: { // Error details from Razorpay
 *     code: "...",
 *     description: "...",
 *     reason: "...",
 *     source: "...",
 *     step: "...",
 *     metadata: {
 *       order_id: "...",
 *       payment_id: "..." // May or may not exist for all failures
 *     }
 *   },
 *   eventName: "..." // Optional, can be fetched if eventId is present
 * }
 */
exports.logFailedPayment = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }

    const { eventId, formData, error, eventName: providedEventName } = request.body;

    if (!formData || !error) {
      logger.error("Missing formData or error details for logging failed payment.", request.body);
      return response.status(400).json({ error: "Missing formData or error details." });
    }

    // Basic validation for formData
    const requiredFormFields = ["fullName", "registrationNumber", "email", "department", "contactNumber"];
    for (const field of requiredFormFields) {
      if (!formData[field]) {
        logger.error(`Missing form data field for failed payment log: ${field}`, formData);
        // Don't fail outright, log what we have
      }
    }

    logger.info("Logging failed payment attempt for eventId:", eventId, "Error:", error);

    try {
      let eventName = providedEventName || "N/A";
      let amount = 0;
      let currency = "INR";

      if (eventId) {
        const eventRef = db.collection("events").doc(eventId);
        const eventDoc = await eventRef.get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data();
          eventName = eventData.eventName || eventName;
          amount = eventData.registrationFee || 0;
          currency = eventData.currency || "INR";
        }
      } else if (error && error.metadata && error.metadata.order_id) {
        // If eventId is not passed but order_id is, try to find eventId from order notes (if we stored it there)
        // This part is more complex and depends on how createRazorpayOrder stores notes.
        // For now, we'll rely on eventId being passed from client.
      }

      const failureData = {
        eventId: eventId || "N/A",
        eventName: eventName,
        fullName: formData.fullName || "N/A",
        registrationNumber: formData.registrationNumber || "N/A",
        email: formData.email || "N/A",
        department: formData.department || "N/A",
        contactNumber: formData.contactNumber || "N/A",
        paymentStatus: "FAILED",
        amountAttempted: amount, // Amount from event data
        currency: currency,
        errorCode: error.code || "N/A",
        errorDescription: error.description || "N/A",
        errorReason: error.reason || "N/A",
        errorSource: error.source || "N/A",
        errorStep: error.step || "N/A",
        razorpayOrderId: (error.metadata && error.metadata.order_id) || "N/A",
        razorpayPaymentId: (error.metadata && error.metadata.payment_id) || "N/A", // payment_id might not exist for all failures
        failureTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      const failureLogRef = await db.collection("registrations").add(failureData);
      logger.info(`Failed payment attempt logged with ID: ${failureLogRef.id}`, failureData);

      return response.status(200).json({
        status: "success",
        message: "Failed payment attempt logged.",
        logId: failureLogRef.id,
      });
    } catch (err) {
      logger.error("Error logging failed payment:", err, request.body);
      return response.status(500).json({ error: "Internal server error while logging failed payment.", details: err.message });
    }
  });
});
