# Metaverse Club Website

Welcome to the official repository for the Metaverse Club website! This document provides a comprehensive overview of the project, its architecture, frontend and backend implementation details, development setup, and deployment instructions.

<a href="https://metaverse-5c533.web.app/">Visit the live site!</a>

## Table of Contents

1.  [Introduction](#introduction)
2.  [System Architecture Overview](#system-architecture-overview)
3.  [Frontend Implementation](#frontend-implementation)
    *   [Core Technologies](#core-technologies)
    *   [Project Structure](#project-structure)
    *   [Key Public Pages & Features](#key-public-pages--features)
        *   [Homepage](#homepage)
        *   [Event Registration Flow](#event-registration-flow)
        *   [Other Forms (Contact, Join Club)](#other-forms)
    *   [Admin Portal (Client-Side)](#admin-portal-client-side)
        *   [Authentication & Setup](#admin-authentication--setup)
        *   [Dashboard Features](#admin-dashboard-features)
4.  [Backend Implementation (Firebase)](#backend-implementation-firebase)
    *   [Firebase Services Used](#firebase-services-used)
    *   [Firestore Database Structure](#firestore-database-structure)
    *   [Cloud Functions](#cloud-functions)
        *   [Managing Razorpay API Keys](#managing-razorpay-api-keys)
    *   [Firebase Security Rules](#firebase-security-rules)
5.  [Payment Flow (End-to-End)](#payment-flow-end-to-end)
6.  [Development Guide](#development-guide)
    *   [Prerequisites](#prerequisites)
    *   [Project Setup](#project-setup)
    *   [Environment Variables](#environment-variables)
    *   [Running Locally](#running-locally)
    *   [Building for Production](#building-for-production)
7.  [Deployment](#deployment)
    *   [Deploying Frontend (Firebase Hosting)](#deploying-frontend-firebase-hosting)
    *   [Deploying Backend (Firebase Functions & Rules)](#deploying-backend-firebase-functions--rules)
8.  [Troubleshooting](#troubleshooting)

---

## 1. Introduction

The Metaverse Club website serves as the primary online presence for the club, offering information about events, membership, and contact details. A key feature is the online event registration system with integrated payment processing via Razorpay. The site also includes a comprehensive admin portal for managing events (including setting an active event for registration, CRUD operations), viewing registrations (successful and failed), user-submitted contact forms, join club requests, and a list of admin users.

---

## 2. System Architecture Overview

The system is built using a modern JavaScript stack, leveraging Firebase for backend services:

*   **Frontend**: A single-page application (SPA) built with React (using Vite for tooling). It's styled with Tailwind CSS and Shadcn UI components, with animations powered by Framer Motion. React Router handles client-side navigation.
*   **Backend**: Firebase Cloud Functions (2nd Gen) provide serverless backend logic for critical operations like creating Razorpay payment orders, verifying payment signatures, logging payment attempts, and managing event active states via Firestore triggers.
*   **Database**: Firebase Firestore is used as the NoSQL database for storing all application data, including event details, user registrations, contact submissions, join requests, and admin user information.
*   **Authentication**: Firebase Authentication is used for admin user sign-up (via a secured setup page) and sign-in.
*   **Hosting**: Firebase Hosting serves the static frontend assets (HTML, CSS, JS) and manages deployments.
*   **Payment Gateway**: Razorpay is integrated for processing online payments for event registrations.
*   **Security**: Sensitive API keys (like Razorpay secrets) are managed using Google Cloud Secret Manager for deployed functions. Firestore Security Rules protect database access.

```
+--------------------------+      +-------------------+
|   User Browser           |----->| Firebase Hosting  |
| (React SPA - Vite)       |<-----| (Static Assets)   |
+--------------------------+      +-------------------+
          |         ^
          | (HTTPS) | (Client SDK)
          v         |
+--------------------------+      +-------------------+
| Firebase Cloud Functions |----->|   Razorpay API    |
| (Node.js - 2nd Gen)      |<-----| (Payment Gateway) |
+--------------------------+      +-------------------+
          |         ^
          | (Admin  | (Client SDK for reads,
          |  SDK)   |  Function SDK for writes)
          v         |
+--------------------------+
| Firebase Firestore       |
| (NoSQL Database)         |
+--------------------------+
          ^
          | (Firestore Trigger)
          |
+--------------------------+
| ensureSingleActiveEvent  |
| (Cloud Function)         |
+--------------------------+

+--------------------------+
|   Admin Browser          |
| (React SPA - Admin Portal)|
+--------------------------+
          |         ^
          | (Client | (Client SDK for Auth)
          |  SDK)   |
          v         |
+--------------------------+      +--------------------------+
| Firebase Firestore       |      | Firebase Authentication  |
| (Admin Data, Events etc.)|      | (Admin Login)            |
+--------------------------+      +--------------------------+
```

---

## 3. Frontend Implementation

### Core Technologies
*   **React 18**: For building the dynamic user interface.
*   **Vite**: Modern frontend build tool providing a fast development server and optimized production builds.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Shadcn UI**: A collection of beautifully designed, accessible, and re-usable UI components built on Radix UI and Tailwind CSS. Components are added directly to the project.
*   **Framer Motion**: For declarative animations and gestures.
*   **React Router (v6/v7)**: For client-side routing and navigation within the SPA.
*   **Lucide React**: For a comprehensive set of simply designed icons.

### Project Structure
```
/metaverse-club
├── functions/              # Firebase Cloud Functions source code
│   ├── index.js            # Main file for all backend functions
│   ├── package.json        # Dependencies for functions
│   └── .eslintrc.js        # ESLint config for functions
├── public/                 # Static assets served directly (e.g., logo.png, favicon)
├── src/
│   ├── assets/             # Images, fonts, etc., imported by components
│   ├── components/
│   │   ├── layout/         # Global layout components (Navbar.jsx, Footer.jsx)
│   │   ├── sections/       # Components representing major sections of pages
│   │   │   ├── admin/      # Components specific to the Admin Dashboard
│   │   │   │   ├── AdminUsersTable.jsx
│   │   │   │   ├── ContactsTable.jsx
│   │   │   │   ├── CreateEventDialog.jsx
│   │   │   │   ├── EventsTable.jsx
│   │   │   │   ├── JoiningRequestsTable.jsx
│   │   │   │   └── RegistrationsTable.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminSetup.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Registration.jsx      (Homepage CTA section)
│   │   │   ├── RegistrationNow.jsx   (Actual registration form page)
│   │   │   └── ... (Other page sections like Contact.jsx, Features.jsx)
│   │   └── ui/             # Shadcn UI components (e.g., button.jsx, card.jsx)
│   ├── firebase/
│   │   └── config.js       # Firebase client SDK initialization and configuration
│   ├── lib/
│   │   └── utils.js        # Utility functions (e.g., `cn` from Shadcn)
│   ├── App.jsx             # Main application component, defines routes
│   ├── main.jsx            # Application entry point, renders App component
│   └── index.css           # Global styles, Tailwind CSS imports, Shadcn CSS variables
├── .env                    # Environment variables for Vite (frontend)
├── .firebaserc             # Firebase project association
├── firebase.json           # Firebase project deployment configuration (hosting, functions, firestore)
├── firestore.indexes.json  # Firestore composite index definitions (if any)
├── firestore.rules         # Firestore security rules
├── jsconfig.json           # JavaScript project configuration (for path aliases)
├── tsconfig.json           # Minimal TypeScript config (to satisfy Shadcn CLI)
├── vite.config.js          # Vite build and dev server configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

### Key Public Pages & Features

#### Homepage (`App.jsx` route for `/`)
*   **Hero Section (`Hero.jsx`)**: A visually engaging full-screen introduction with a background image and animated text. It also includes an "About Us" section (using Shadcn `Card`s) that overlaps the hero section, and a "Core Values" display. Typography is styled using Tailwind and Shadcn theme variables (`text-foreground`, `text-muted-foreground`, `text-primary`).
*   **Registration Call-to-Action (`Registration.jsx`)**: This section on the homepage dynamically identifies the currently active event by querying the `events` collection in Firestore for a document where `isActive === true`. The "Register Now" button then links directly to the registration form for that specific event (e.g., `/register-now/EVENT_ID`). If no event is active, the button is disabled.
*   **Features Section (`Features.jsx`)**: Highlights key aspects or offerings of the Metaverse Club.

#### Event Registration Flow
*   **Dynamic Event Link**: The "Register Now" button in `Registration.jsx` fetches the active event ID from Firestore.
*   **Registration Form Page (`RegistrationNow.jsx` - Route: `/register-now/:eventId`)**:
    *   Fetches event details (name, registration fee, currency) for the `eventId` from the URL parameter.
    *   Displays a registration form built with Shadcn UI components (`Card`, `Input`, `Label`). Users provide Full Name, Registration Number, Email, Department, and Contact Number.
    *   **Client-Side Razorpay Integration**:
        1.  On form submission, it calls the `createRazorpayOrder` Firebase Function (via HTTPS POST) with the `eventId`.
        2.  The backend function returns Razorpay order details (`order_id`, `amount`, `currency`, `razorpayKeyId`).
        3.  The frontend loads the Razorpay Checkout script (`checkout.js`).
        4.  It initializes Razorpay Checkout using the received order details. The `handler` function is set up for successful payments, and a `payment.failed` listener for failures.
        5.  The Razorpay payment modal opens.
        6.  **On Success**: The `handler` receives payment identifiers from Razorpay (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`). These, along with `eventId` and form data, are sent to the `verifyRazorpayPaymentAndSaveRegistration` Firebase Function. If verification is successful, the user is navigated to `/payment-success`.
        7.  **On Failure**: The `payment.failed` listener is triggered. It calls the `logFailedPayment` Firebase Function with error details and form data, then navigates the user to `/payment-failed`.
*   **Payment Feedback Pages**:
    *   `PaymentSuccess.jsx`: Displays a success message, payment ID, order ID, and event name. Styled with Shadcn `Card`.
    *   `PaymentFailed.jsx`: Displays a failure message, error details from Razorpay, and event name. Styled with Shadcn `Card`.

#### Other Forms
*   **Contact Form (`Contact.jsx`)**: Standard form for user inquiries. Submissions are saved to the `contacts` collection in Firestore.
*   **Join Club Form (`JoinForm.jsx`)**: Form for users to apply for club membership. Submissions are saved to the `joining_requests` collection.

### Admin Portal (Client-Side)

#### Admin Authentication & Setup
*   **Login Page (`AdminLogin.jsx` - Route: `/admin`)**:
    *   Provides email/password login fields.
    *   Uses Firebase Authentication (`signInWithEmailAndPassword`).
    *   Upon successful authentication, it redirects to `/admin/dashboard`.
*   **Protected Routes (`ProtectedRoute.jsx`)**:
    *   A higher-order component that wraps routes requiring admin authentication (e.g., `/admin/dashboard`, `/admin/setup`).
    *   Uses `onAuthStateChanged` to monitor the user's authentication state.
    *   If a user is not authenticated, they are redirected to `/admin` (login page). The intended path is preserved in route state for redirection after successful login.
    *   *Note: Currently, it only checks for authentication, not a specific admin role via Firestore for route protection itself. Admin-specific content access is managed within the dashboard.*
*   **Admin Setup Page (`AdminSetup.jsx` - Route: `/admin/setup`)**:
    *   Allows an existing authenticated admin to create new admin accounts.
    *   Requires a `setupKey` (currently "metaverse123" - **MUST be changed for production and managed securely**).
    *   Creates a new user in Firebase Authentication using `createUserWithEmailAndPassword`.
    *   Adds a document to the `admin` collection in Firestore containing the new admin's email and UID.

#### Admin Dashboard Features (`AdminDashboard.jsx` - Route: `/admin/dashboard`)
A central hub for managing application data, built with a modular structure and real-time data updates.
*   **Core Structure & State Management**:
    *   Manages state for `registrations`, `contacts`, `joiningRequests`, `events`, `adminUsers`, `activeTab`, `searchTerm`, loading/error states, and dialog states.
    *   Uses `useEffect` to set up `onSnapshot` listeners for all relevant Firestore collections, providing real-time data updates. Listeners are cleaned up on component unmount.
*   **Tabbed Navigation**: Allows switching between different data views: Registrations, Contacts, Join Requests, Manage Events, Admin Users.
*   **Search & Filtering**:
    *   A search input allows filtering data within the active tab.
    *   For most tabs, search is across all fields of the items.
    *   A category dropdown (for Contacts and Join Requests) allows more specific field searches. This dropdown is hidden for Registrations (defaults to all-field search) and Events/Admin Users tabs.
*   **Data Export**:
    *   For Registrations, Contacts, and Join Requests tabs.
    *   An "Export Data" button triggers a Shadcn `DropdownMenu` with options to download data as CSV or XLSX (TSV format).
*   **Modular Table Components (`src/components/sections/admin/`)**:
    *   `RegistrationsTable.jsx`: Displays all registration entries (successful and failed) with columns for Full Name, Reg No., Email, Event, Status, Payment ID, Order ID, Date, and detailed sub-columns for Department, Contact, and Error Info.
    *   `ContactsTable.jsx`: Displays contact submissions.
    *   `JoiningRequestsTable.jsx`: Displays join club requests.
    *   `EventsTable.jsx`:
        *   Lists all events with Event Name, Fee, and Status (Active/Inactive).
        *   **Actions Column**:
            *   "Set Active" button (for inactive events): Calls `handleSetActiveEvent` which updates `isActive: true` in Firestore.
            *   "Edit" button: Calls `handleOpenEditEventDialog` to open a modal pre-filled with event data.
            *   "Delete" button: Calls `handleDeleteEvent` which prompts for confirmation and then deletes the event document.
    *   `AdminUsersTable.jsx`: Lists admin users from the `admin` collection (Email, UID, placeholder for Roles). Currently read-only display.
*   **Event Creation/Editing Dialog (`CreateEventDialog.jsx`)**:
    *   A reusable Shadcn `Dialog` component used for both creating new events and editing existing ones.
    *   Triggered from the "Events" tab.
    *   Form fields: Event Name, Registration Fee (input as currency value, stored as paisa/cents), Currency, Description, "Is Active" checkbox.
    *   Handles form submission via `handleCreateNewEvent` or `handleUpdateEvent` in `AdminDashboard.jsx`.

---

## 4. Backend Implementation (Firebase)

### Firebase Services Used
*   **Firebase Authentication**: For admin user identity management (email/password sign-in).
*   **Firestore**: NoSQL database for storing application data (events, registrations, contacts, etc.).
*   **Cloud Functions for Firebase (2nd Gen)**: For serverless backend logic, primarily for Razorpay integration and automated database tasks.
*   **Firebase Hosting**: For serving the static frontend application.
*   **Google Cloud Secret Manager**: Used to securely store sensitive API keys (like Razorpay Key Secret) for deployed Cloud Functions.

### Firestore Database Structure
```
firestore/
│
├── admin/                                # Collection for admin user records
│   └── [admin_doc_id]                    # Typically, document ID could be Firebase Auth UID or sanitized email
│       { 
│         email: "admin@example.com", 
│         uid: "firebase_auth_uid",       # Firebase Auth User ID
│         role: "admin",                  # Optional: for role-based access
│         createdAt: Timestamp 
│       }
│
├── events/                               # Collection for event details
│   └── [event_id]                        # Auto-generated Firestore ID
│       { 
│         eventName: "Event Title", 
│         registrationFee: 50000,         # In smallest currency unit (e.g., paise for INR)
│         currency: "INR", 
│         description: "Event details...", 
│         isActive: true,                 # Boolean flag for active event
│         createdAt: Timestamp            # Timestamp of event creation
│       }
│
├── registrations/                        # Collection for all registration attempts (successful & failed)
│   └── [registration_id]                 # Auto-generated Firestore ID
│       // For successful registration:
│       { 
│         eventId: "event_doc_id", 
│         eventName: "Event Title", 
│         fullName: "User Full Name", 
│         registrationNumber: "USER_REG_NO", 
│         email: "user@example.com", 
│         department: "CS", 
│         contactNumber: "1234567890", 
│         paymentId: "razorpay_payment_id", 
│         orderId: "razorpay_order_id", 
│         paymentSignature: "razorpay_signature", 
│         paymentStatus: "SUCCESSFUL", 
│         amountPaid: 50000,              # Amount paid, in smallest currency unit
│         currency: "INR", 
│         registrationTimestamp: Timestamp 
│       }
│       // For failed payment log:
│       { 
│         eventId: "event_doc_id", 
│         eventName: "Event Title", 
│         fullName: "User Full Name", 
│         registrationNumber: "USER_REG_NO", 
│         email: "user@example.com", 
│         department: "CS", 
│         contactNumber: "1234567890", 
│         paymentStatus: "FAILED", 
│         amountAttempted: 50000,         # Amount attempted, in smallest currency unit
│         currency: "INR", 
│         errorCode: "RAZORPAY_ERROR_CODE", 
│         errorDescription: "Razorpay error description", 
│         errorReason: "Razorpay error reason", 
│         razorpayOrderId: "razorpay_order_id", # Order ID if generated
│         failureTimestamp: Timestamp 
│       }
│
├── contacts/                             # Collection for contact form submissions
│   └── [contact_id]                      # Auto-generated Firestore ID
│       { 
│         fname: "First Name", 
│         lname: "Last Name", 
│         email: "user@example.com", 
│         phone_number: "1234567890", 
│         message: "User's message", 
│         servicechoice: "General Inquiry", 
│         timestamp: Timestamp 
│       }
│
└── joining_requests/                     # Collection for join club requests
    └── [request_id]                      # Auto-generated Firestore ID
        { 
          fullname: "User Full Name", 
          email: "user@example.com", 
          reg_number: "USER_REG_NO", 
          phone_number: "1234567890", 
          department: "CS", 
          reason: "Reason for joining", 
          timestamp: Timestamp 
        }
```

### Cloud Functions (`functions/index.js`)
All functions are 2nd Gen HTTP callable functions or Firestore-triggered functions. They are configured to access Razorpay API keys from Google Cloud Secret Manager when deployed.

*   **`createRazorpayOrder` (HTTP Callable)**:
    *   **Purpose**: To securely create a payment order with Razorpay using server-side API keys.
    *   **Trigger**: Called via an HTTPS POST request from the frontend (`RegistrationNow.jsx`) when a user initiates the payment process.
    *   **Logic**:
        1.  Receives `eventId` in the request body.
        2.  Fetches the corresponding event document from the `events` collection in Firestore to get `registrationFee`, `currency`, and `isActive` status.
        3.  Validates that the event is active and the registration fee is valid.
        4.  Retrieves `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` from environment variables (sourced from Secret Manager when deployed).
        5.  Initializes the Razorpay SDK instance.
        6.  Calls Razorpay's `orders.create` API with the amount (in smallest currency unit), currency, a unique receipt ID, and notes (like `eventId`, `eventName`). `payment_capture` is set to `1` for auto-capture.
        7.  Returns the Razorpay `order.id`, `order.amount`, `order.currency`, and the `RAZORPAY_KEY_ID` (public key) to the frontend.
*   **`verifyRazorpayPaymentAndSaveRegistration` (HTTP Callable)**:
    *   **Purpose**: To securely verify the payment signature received from Razorpay and, if valid, save the registration details to Firestore.
    *   **Trigger**: Called via an HTTPS POST request from the frontend after the Razorpay checkout process returns a success response to the client.
    *   **Logic**:
        1.  Receives `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`, `eventId`, and user `formData` in the request body.
        2.  Constructs the verification string: `razorpay_order_id + "|" + razorpay_payment_id`.
        3.  Retrieves the `RAZORPAY_SECRET` from environment variables.
        4.  Generates an HMAC-SHA256 signature of the verification string using the `RAZORPAY_SECRET`.
        5.  Compares the generated signature with the `razorpay_signature` received from the client.
        6.  **If signatures match (payment is authentic)**:
            *   Fetches event details (`eventName`, `registrationFee`, `currency`) from Firestore for record-keeping.
            *   Creates a new document in the `registrations` collection with all form data, payment details, event information, `paymentStatus: "SUCCESSFUL"`, and a `registrationTimestamp`.
            *   Returns a success status and the new registration ID to the frontend.
        7.  **If signatures do not match**: Returns a failure status, indicating a potential tampering or error.
*   **`logFailedPayment` (HTTP Callable)**:
    *   **Purpose**: To log details of a failed payment attempt into Firestore for administrative review.
    *   **Trigger**: Called via an HTTPS POST request from the frontend when the Razorpay `payment.failed` event is triggered on the client.
    *   **Logic**:
        1.  Receives `eventId`, `formData`, the Razorpay `error` object (containing `code`, `description`, `reason`, etc.), and `eventName`.
        2.  Constructs a data object including all received information and sets `paymentStatus: "FAILED"`.
        3.  Creates a new document in the `registrations` collection with these failure details and a `failureTimestamp`.
*   **`ensureSingleActiveEvent` (Firestore Trigger - v2 `onDocumentWritten`)**:
    *   **Purpose**: To automatically maintain data integrity by ensuring that only one event document in the `events` collection can have its `isActive` field set to `true` at any given time.
    *   **Trigger**: This function is invoked automatically by Firestore whenever any document in the `events/{eventId}` path is created or updated.
    *   **Logic**:
        1.  Examines the change: if the `isActive` field of the written document was just changed to `true` (and it wasn't `true` before, or the document is newly created as active).
        2.  If an event was just activated, it queries the `events` collection for any *other* documents that also have `isActive: true`.
        3.  If such other active events are found, it uses a Firestore batch write to update all of them, setting their `isActive` field to `false`. This ensures the newly activated event is the sole active one.

#### Managing Razorpay API Keys
The Razorpay API Key ID and Key Secret are sensitive credentials required by the `createRazorpayOrder` and `verifyRazorpayPaymentAndSaveRegistration` Cloud Functions.

*   **Deployed Functions (Production/Staging):**
    *   These keys are securely stored using **Google Cloud Secret Manager**.
    *   The Cloud Functions are configured with `runWith({ secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET"] })` to automatically access these secrets as environment variables at runtime.
    *   **To update these keys:**
        1.  Go to the Google Cloud Console for your Firebase project.
        2.  Navigate to "Security" > "Secret Manager".
        3.  Find the secrets named `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET`. If they don't exist, create them.
        4.  Create a new version for each secret with the updated key value.
        5.  Ensure the Cloud Functions service account (typically `PROJECT_ID@appspot.gserviceaccount.com`) has the "Secret Manager Secret Accessor" IAM role for these secrets. This is usually granted by default when enabling APIs but good to verify.
        6.  The functions will pick up the new secret version on their next cold start or instance refresh. Redeploying functions (`firebase deploy --only functions`) can expedite this.

*   **Local Development & Emulation:**
    *   When using Firebase Emulators (`firebase emulators:start`), Secret Manager is not directly emulated.
    *   Manage local keys by:
        1.  **`.env` file in `functions` directory:** Create a `.env` file (ensure this file is added to `.gitignore` to prevent committing secrets):
            ```
            RAZORPAY_KEY_ID=your_razorpay_test_key_id
            RAZORPAY_SECRET=your_razorpay_test_key_secret
            ```
            Then, in `functions/index.js`, load these for local emulation only:
            ```javascript
            // At the top of functions/index.js
            if (process.env.FUNCTIONS_EMULATOR === 'true') {
              require('dotenv').config(); // Run: cd functions && npm install dotenv
            }
            // Keys are then available via process.env.RAZORPAY_KEY_ID and process.env.RAZORPAY_SECRET
            ```
    *   The client-side `RegistrationNow.jsx` receives the `razorpayKeyId` (public key) from the `createRazorpayOrder` function's response. This key is safe to expose on the client. The `RAZORPAY_SECRET` **must never** be exposed on the client.

### Firebase Security Rules (`firestore.rules`)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin setup collection: Used for initial admin creation and potentially storing admin roles/emails.
    match /admin/{document=**} {
      // Authenticated users (presumably admins who have logged in) can read admin data.
      allow read: if request.auth != null;
      // Writes (like creating a new admin via /admin/setup) are only allowed if the request includes the correct setupKey.
      // This is a basic protection for the setup mechanism.
      allow write: if request.resource.data.setupKey == "metaverse123"; // Change "metaverse123" for production!
    }
    
    // Event registrations: Stores details of users who registered for events.
    match /registrations/{document=**} {
      // Client-side creation is disallowed. Registrations are created server-side by Cloud Functions 
      // after successful payment verification to ensure data integrity.
      allow create: if false; 
      // Authenticated users (admins) can read registration data from the dashboard.
      allow read: if request.auth != null; 
      // Client-side updates and deletes of registration records are disallowed.
      allow update, delete: if false; 
    }
    
    // Contact form submissions
    match /contacts/{document=**} {
      // Anyone can submit the contact form.
      allow create: if true;
      // Authenticated users (admins) can read contact submissions from the dashboard.
      allow read: if request.auth != null;
    }
    
    // Join club requests
    match /joining_requests/{document=**} {
      // Anyone can submit a join request.
      allow create: if true;
      // Authenticated users (admins) can read join requests from the dashboard.
      allow read: if request.auth != null;
    }

    // Events: Stores details about club events.
    match /events/{eventId} {
      // Event details are public to read (e.g., for displaying on the registration form or event listings).
      allow read: if true; 
      // Authenticated users (admins) can create, update, and delete events from the admin dashboard.
      allow write: if request.auth != null; 
    }
    
    // Default deny: All other paths/collections not explicitly matched are denied read/write access.
    // This is a security best practice.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. Payment Flow (End-to-End)

1.  **User Action**: User fills the registration form on `RegistrationNow.jsx` for a specific event and clicks "Submit Registration & Pay".
2.  **Frontend**: The `handleSubmit` function in `RegistrationNow.jsx` is triggered.
    *   It first ensures the Razorpay Checkout script is loaded.
    *   Then, it makes an HTTPS POST request to the `createRazorpayOrder` Cloud Function, sending the `eventId`.
3.  **Backend (`createRazorpayOrder` Function)**:
    *   Receives `eventId`.
    *   Fetches event details (fee, currency, active status) from Firestore's `events` collection.
    *   Validates that the event is active and the fee is positive.
    *   Uses the Razorpay SDK (with server-side API keys obtained from Secret Manager) to call Razorpay's API and create a payment order.
    *   Returns the `orderId`, amount, currency, and the public `razorpayKeyId` to the frontend.
4.  **Frontend**:
    *   Receives the order details from the Cloud Function.
    *   Initializes the Razorpay Checkout instance with these details. This includes:
        *   `key`: The public `razorpayKeyId`.
        *   `amount`: The order amount (in smallest currency unit).
        *   `currency`: The order currency.
        *   `order_id`: The ID of the order created by Razorpay.
        *   `name`: Club name for display.
        *   `description`: Event name for display.
        *   `prefill`: User's name, email, contact from the form.
        *   `handler`: A callback function to be executed upon successful payment.
        *   `modal.ondismiss`: A callback for when the Razorpay modal is closed by the user.
        *   `events`: An object to listen for `payment.failed` events.
    *   Opens the Razorpay payment modal.
5.  **User Interaction**: User completes the payment process within the Razorpay modal (e.g., enters card details, UPI, etc.).
6.  **Razorpay Callback (Success)**:
    *   If payment is successful, Razorpay calls the `handler` function provided by the frontend during initialization. This handler receives an object containing `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
    *   **Frontend**: Makes an HTTPS POST request to the `verifyRazorpayPaymentAndSaveRegistration` Cloud Function, sending these payment identifiers, the original `eventId`, and the user's `formData`.
7.  **Backend (`verifyRazorpayPaymentAndSaveRegistration` Function)**:
    *   Receives all payment details and form data.
    *   Crucially, it verifies the `razorpay_signature` by generating its own signature using the `razorpay_order_id`, `razorpay_payment_id`, and the `RAZORPAY_SECRET` (from Secret Manager). This ensures the payment details are authentic and haven't been tampered with.
    *   **If signature verification is successful**:
        *   Saves the complete registration data (user's form input, event details, payment IDs, amount, and `paymentStatus: "SUCCESSFUL"`) to the `registrations` collection in Firestore. A `registrationTimestamp` is added.
        *   Returns a success status to the frontend.
    *   **If signature verification fails**: Returns a failure status.
8.  **Frontend**:
    *   If the backend verification is successful, navigates the user to the `/payment-success` page, displaying a confirmation.
    *   If verification fails, an error alert is shown.
9.  **Razorpay Callback (Failure)**:
    *   If the payment fails within the Razorpay modal (e.g., card declined, user cancels), Razorpay triggers the `payment.failed` event on the client.
    *   **Frontend**: The listener for this event is invoked. It makes an HTTPS POST request to the `logFailedPayment` Cloud Function, sending `eventId`, `formData`, and the error details provided by Razorpay.
    *   Navigates the user to the `/payment-failed` page, displaying the error.
10. **Backend (`logFailedPayment` Function)**:
    *   Receives the failure details.
    *   Saves this information (including `paymentStatus: "FAILED"`) to the `registrations` collection in Firestore for administrative review and record-keeping. A `failureTimestamp` is added.

---

## 6. Development Guide

### Prerequisites
*   Node.js (v18.x or later recommended for Firebase Functions v2)
*   npm (v7.x or later recommended)
*   Firebase Account and Firebase CLI installed globally (`npm install -g firebase-tools`)
*   Razorpay Test Account (to get test API Key ID and Key Secret)

### Project Setup
1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd metaverse-club
    ```
2.  **Install Root Dependencies** (for the frontend React app):
    ```bash
    npm install
    ```
3.  **Install Functions Dependencies**:
    ```bash
    cd functions
    npm install
    cd ..
    ```
4.  **Shadcn UI Initialization** (if not already set up or if `components.json` / `src/components/ui` are missing):
    *   Ensure your `jsconfig.json` (or `tsconfig.json` if you were using TypeScript) and `vite.config.js` have path aliases configured (e.g., `@/*` pointing to `./src/*`).
    *   Run `npx shadcn@latest init`. When prompted:
        *   Style: New York
        *   Base Color: Neutral (or your preference)
        *   CSS Variables: Yes
        *   `tailwind.config.js` path: `tailwind.config.js`
        *   Global CSS file: `src/index.css`
        *   Components alias: `@/components`
        *   Utils alias: `@/lib/utils`
        *   React Server Components: No
    *   This creates `components.json` and updates `tailwind.config.js` and `src/index.css`.
    *   Add necessary components:
        ```bash
        npx shadcn@latest add button card input label checkbox dialog textarea dropdown-menu toast
        ```

### Environment Variables
*   **Frontend (`.env` file in the project root)**:
    These variables are used by the Firebase client SDK. Vite requires them to be prefixed with `VITE_`.
    ```env
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
    These are accessed in `src/firebase/config.js` using `import.meta.env.VITE_FIREBASE_API_KEY`, etc.

*   **Backend (Firebase Functions - for Local Emulation)**:
    For local development with Firebase Emulators, Cloud Functions (2nd Gen) can access environment variables. The recommended way for sensitive keys like Razorpay's is to use a `.env` file within the `functions` directory.
    1.  Create `functions/.env` (ensure this file is in `functions/.gitignore` and the root `.gitignore`).
    2.  Add your Razorpay **test** keys:
        ```
        RAZORPAY_KEY_ID=rzp_test_yourkeyid
        RAZORPAY_SECRET=yourtestkeysecret
        ```
    3.  Install `dotenv` in the functions directory: `cd functions && npm install dotenv && cd ..`
    4.  Load these variables at the top of `functions/index.js`:
        ```javascript
        if (process.env.FUNCTIONS_EMULATOR === 'true') {
          require('dotenv').config();
        }
        // Now process.env.RAZORPAY_KEY_ID and process.env.RAZORPAY_SECRET are available
        ```
    For deployed functions, these are managed via Google Cloud Secret Manager (see Deployment section).

### Running Locally
1.  **Start Firebase Emulators** (recommended for full backend testing):
    Open a terminal in the project root and run:
    ```bash
    firebase emulators:start --only functions,firestore,auth
    ```
    This starts local emulators for Cloud Functions, Firestore database, and Authentication. The Firebase client SDK in your frontend might need to be configured to point to these emulators if not done automatically by `firebase/config.js`. (Usually, if emulators are running, the SDKs detect and use them).
    You can access the Emulator UI at `http://localhost:4000`.

2.  **Start the Vite Development Server**:
    Open another terminal in the project root and run:
    ```bash
    npm run dev
    ```
3.  Open your browser and navigate to `http://localhost:5175` (or the port Vite indicates).

### Building for Production
To create an optimized production build of the frontend:
```bash
npm run build
```
The build artifacts will be placed in the `dist/` directory.

---

## 7. Deployment

### Deploying Frontend (Firebase Hosting)
1.  **Login to Firebase CLI**:
    ```bash
    firebase login
    ```
2.  **Initialize Firebase Hosting** (if you haven't already for this project):
    ```bash
    firebase init hosting
    ```
    *   Select your Firebase project ("metaverse-5c533").
    *   Set `dist` as your public directory.
    *   Configure as a single-page app (rewrite all URLs to `/index.html`): Yes.
    *   Set up automatic builds and deploys with GitHub: No (unless desired).
    *   File `dist/index.html` already exists. Overwrite? No.
3.  **Verify `firebase.json`**: Ensure the `hosting` section correctly points to your build directory (`dist`) and has rewrites for a single-page app.
    ```json
    {
      "hosting": {
        "public": "dist",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      },
      // ... other configurations (functions, firestore)
    }
    ```
4.  **Build Your Project for Production**:
    ```bash
    npm run build
    ```
5.  **Deploy to Firebase Hosting**:
    ```bash
    firebase deploy --only hosting
    ```

### Deploying Backend (Firebase Functions & Rules)
1.  **Set up Secrets in Google Cloud Secret Manager** (for deployed functions):
    *   Navigate to Google Cloud Console > Security > Secret Manager for your Firebase project.
    *   Create secrets named `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` and add your **live** Razorpay key values as secret versions.
    *   Ensure the Cloud Functions service account (usually `PROJECT_ID@appspot.gserviceaccount.com`) has the "Secret Manager Secret Accessor" IAM role for these secrets.
    *   The functions in `functions/index.js` are configured with `runWith({ secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET"] })` to use these.
2.  **Deploy Cloud Functions**:
    ```bash
    firebase deploy --only functions
    ```
3.  **Deploy Firestore Security Rules**:
    ```bash
    firebase deploy --only firestore:rules
    ```
4.  **Deploy Firestore Indexes** (if `firestore.indexes.json` has been modified or needs to be created):
    ```bash
    firebase deploy --only firestore:indexes
    ```
    Alternatively, to deploy all Firebase features defined in `firebase.json`:
    ```bash
    firebase deploy
    ```

---

## 8. Troubleshooting
*   **Admin Login/Access Issues**:
    *   Verify credentials.
    *   Check the `admin` collection in Firestore for the user's email/UID.
    *   Ensure `ProtectedRoute.jsx` correctly handles authentication state.
    *   For initial setup, ensure the `setupKey` in `AdminSetup.jsx` matches the one expected by Firestore rules for writing to `/admin`.
*   **Firestore Permissions ("Missing or insufficient permissions")**:
    *   Use the Firestore Rules Playground in the Firebase Console to test operations against your rules.
    *   Ensure the authenticated user (`request.auth`) meets the conditions in `firestore.rules` for the attempted operation (read/write) on the specific path.
    *   Verify rules have been deployed successfully.
*   **Cloud Function Errors**:
    *   Check logs in Google Cloud Console: Cloud Functions > Select your function > Logs.
    *   For deployed functions, ensure secrets in Secret Manager are correctly named, have correct values, and the function's service account has access.
    *   For local emulation, ensure emulators are running, `.env` in `functions` is correctly set up if used, and `dotenv` is loaded.
*   **Razorpay Integration Issues**:
    *   **API Keys**: Double-check `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` in Google Cloud Secret Manager (for deployed functions) or your local `.env` file (for emulation). Use test keys for development and live keys for production.
    *   **Key ID on Client**: Ensure the `createRazorpayOrder` function correctly returns the `razorpayKeyId` (public key) to the client for initializing Razorpay Checkout.
    *   **Secret Key Server-Side**: Confirm the `RAZORPAY_SECRET` is only used server-side in `verifyRazorpayPaymentAndSaveRegistration` and matches the Key ID used for the order.
    *   **"Signature Mismatch"**: This is a common error if the secret key is wrong or the string used for generating the signature in `verifyRazorpayPaymentAndSaveRegistration` doesn't exactly match what Razorpay expects (`order_id + "|" + payment_id`).
    *   **Amount**: Ensure amounts are always passed to Razorpay in the smallest currency unit (e.g., paise for INR, cents for USD).
    *   **Network Requests**: Use browser developer tools to inspect network calls to your Cloud Functions and to Razorpay's API for error messages or unexpected responses.
*   **Shadcn UI / Tailwind CSS Styling Issues**:
    *   Confirm `tailwind.config.js` includes paths to all component files in its `content` array.
    *   Verify `src/index.css` (or your global CSS file) correctly imports Tailwind base styles and any Shadcn UI theme variables.
    *   Ensure Shadcn components were added to your project using `npx shadcn@latest add <component-name>`.
*   **Vite Import Errors / Module Resolution**:
    *   Check path aliases (`@/*`) in `vite.config.js` and `jsconfig.json` (or `tsconfig.json`).
    *   Ensure imported files/modules exist at the specified paths and are correctly exported/imported.
    *   Restart the Vite dev server after significant config changes.

---
This updated README provides a more holistic view of the project.
