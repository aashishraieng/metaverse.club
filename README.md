

# Metaverse Club

This is the official website of the Metaverse Club. <a href="https://metaverse-5c533.web.app/
">Visit now!</a>

## Development Guide

This section provides instructions for setting up, running, building, and deploying the Metaverse Club website.

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Firebase account (for deployment)
- Firebase CLI (`npm install -g firebase-tools`)

### Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/metaverse.club.git
   cd metaverse.club
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5175
   ```

### Building for Production

Create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment to Firebase

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   During initialization:
   - Select "Hosting"
   - Choose your Firebase project
   - Set `dist` as the public directory
   - Configure as a single-page app
   - Don't overwrite `index.html`

3. Update `firebase.json` to ensure it points to your build directory:
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
     }
   }
   ```

4. Build your project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

6. Access your deployed site at:
   ```
   https://your-project-id.web.app
   ```

### Common Issues

- **Firebase Configuration**: Ensure your Firebase project has Authentication and Firestore enabled
- **Deployment Issues**: Verify your `firebase.json` points to the correct build directory
- **Build Errors**: Check for any missing dependencies or environment variables
- **Routing Issues**: The `rewrites` in `firebase.json` ensure proper routing with React Router

---

# Admin Portal Implementation

This section provides a comprehensive explanation of how the admin portal for the Metaverse Club website has been implemented using Firebase. It covers the authentication system, security measures, component structure, and implementation details.

## Table of Contents

1. [System Overview](#system-overview)
2. [Firebase Implementation](#firebase-implementation)
3. [Initial Setup Instructions](#initial-setup-instructions)
4. [Authentication Flow](#authentication-flow)
5. [Security Rules](#security-rules)
6. [Component Architecture](#component-architecture)
7. [Data Management](#data-management)
8. [Search and Export Functionality](#search-and-export-functionality)
9. [Deployment Considerations](#deployment-considerations)
10. [Troubleshooting](#troubleshooting)

## System Overview

The admin portal provides authorized administrators with the ability to:

- View and search registration data
- Export registration data in CSV and Excel formats
- Set up new admin users through a protected interface
- Maintain secure access control to sensitive information

The system uses Firebase Authentication for user management and Firebase Firestore for data storage. The frontend is built with React and uses modern UI patterns for a responsive and intuitive experience.

## Firebase Implementation

### Firebase Services Used

1. **Firebase Authentication**: Handles user login, session management, and authentication state
2. **Firestore Database**: Stores registration data and admin user information
3. **Firebase Security Rules**: Controls access to Firestore documents based on authentication status and admin privileges

### Firebase Configuration

The Firebase configuration is stored in `frontendd/src/firebase/config.js`:

```javascript
// Basic Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin authorization helper
const isAuthorizedAdmin = (email) => {
  const ADMIN_EMAILS = [
    "erdkrai04@gmail.com",
    // Add other admin emails here as a fallback
  ];
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export { app, db, auth, isAuthorizedAdmin };
```

## Initial Setup Instructions

### Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and select your project "metaverse-5c533"
2. Set up the following services:
   - Authentication
   - Firestore Database

### Email/Password Authentication Setup

1. Navigate to Authentication → Sign-in methods in the Firebase Console
2. Enable Email/Password as a sign-in provider (if not already enabled)
3. Add your authorized domains:
   - Your local development domain (localhost)
   - Your production domain if deployed

### Firestore Database Setup

1. Go to Firestore Database in the Firebase Console
2. Create the database in a region close to your target audience
3. Start in test mode, but make sure to update security rules as shown in the [Security Rules](#security-rules) section before deploying to production

### Setting Up Firestore Security Rules

1. In the Firebase Console, navigate to Firestore Database → Rules
2. Copy and paste the security rules from the [Security Rules](#security-rules) section
3. Click "Publish" to apply the rules

### Creating Initial Admin User

The recommended way to create the first admin user is through the Admin Setup page:

1. Navigate to `/admin/setup` in your application
2. Use the setup key: `metaverse123`
3. Enter the admin email and password
4. Click "Setup Admin Access"

This will:
- Create a user in Firebase Authentication
- Add the email to the admin list in Firestore

### Environment Variables

Create a `.env` file in your project root with the following Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Authentication Flow

Our admin authentication system uses a multi-layered approach:

### 1. Email/Password Authentication

Administrators log in using email and password credentials through Firebase Authentication. The process involves:

1. User enters credentials on the `/admin` route
2. The credentials are verified by Firebase Authentication
3. If successful, the system checks if the user has admin privileges

### 2. Admin Authorization Check

Admin privileges are verified through multiple methods, in this order:

1. **Hardcoded Admin List**: A fallback list of admin emails in the `config.js` file
2. **Firestore `allowedEmails` Document**: A document in the "admin" collection with an array of authorized email addresses
3. **Individual Admin Documents**: Dedicated documents for each admin user

```javascript
// Admin check process (simplified)
const checkAdminStatus = async (email) => {
  // 1. Check hardcoded list
  if (isAuthorizedAdmin(email)) return true;
  
  // 2. Check Firestore allowedEmails document
  const adminDoc = await getDoc(doc(db, "admin", "allowedEmails"));
  if (adminDoc.exists() && adminDoc.data().emails?.includes(email)) return true;
  
  // 3. Check individual admin document
  const individualAdminDoc = await getDoc(doc(db, "admin", email.replace(/[.#$\/\[\]]/g, '_')));
  if (individualAdminDoc.exists() && individualAdminDoc.data().email === email) return true;
  
  return false;
};
```

### 3. Protected Routes

Protected routes use a `ProtectedRoute` component that:

1. Checks if the user is authenticated
2. Verifies admin status
3. Redirects to login if either check fails
4. Preserves the intended destination for post-login redirection

```jsx
// ProtectedRoute component (simplified)
export function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check admin status
        const isAdmin = await checkAdminStatus(currentUser.email);
        setIsAdmin(isAdmin);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin" state={{ intendedPath: location.pathname }} />;
  }
  
  return children;
}
```

### 4. Admin Dashboard Access

1. Go to `/admin` in your application
2. Sign in with the email and password you created during admin setup
3. After successful authentication, you'll be redirected to the admin dashboard

## Security Rules

### Firestore Security Rules

Our Firestore security rules enforce a strict access control policy. Copy and paste these rules into your Firebase Console > Firestore Database > Rules tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin access rules - simplified to allow initial setup
    match /admin/{document=**} {
      // Allow reads for all documents if user is authenticated
      allow read: if request.auth != null;
      
      // Allow writes if the setupKey is correct
      allow write: if request.resource.data.setupKey == "metaverse123";
    }
    
    // Registrations access rules
    match /registrations/{document=**} {
      // Anyone can create registrations (for the registration form)
      allow create: if true;
      
      // Only authenticated users can read registrations
      allow read: if request.auth != null;
    }
    
    // Default deny all other operations
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

These rules implement the following security policies:

1. **Admin Documents**: 
   - Only authenticated users can read admin documents
   - Only requests with the correct setup key can write to admin documents

2. **Registration Documents**:
   - Anyone can create registration documents (for the public registration form)
   - Only authenticated users can read registration data

3. **Default Deny**:
   - All other operations on any collection are denied by default

### Additional Security Measures

1. **Setup Key**: A setup key (`metaverse123`) is required to add new admin users
2. **Path-based Access Control**: Admin setup is only accessible from the dashboard after login
3. **Login Redirection**: State preservation during redirects prevents navigation loops
4. **Protected Routes**: The `ProtectedRoute` component ensures only authenticated admins can access sensitive pages

## Component Architecture

The admin portal consists of these key components:

### 1. AdminLogin Component

- Handles authentication
- Verifies admin status
- Manages redirection to intended destinations
- Provides debug information

### 2. ProtectedRoute Component

- Guards routes requiring authentication
- Performs admin checks
- Manages loading states
- Handles redirection

### 3. AdminDashboard Component

- Displays registration data
- Provides search functionality with field filtering
- Offers data export options
- Includes navigation to admin setup

### 4. AdminSetup Component

- Creates new admin users
- Adds users to Firebase Authentication
- Updates Firestore admin records
- Requires an existing admin account and setup key

### Component Workflow

```
User → AdminLogin → Authentication → ProtectedRoute → AdminDashboard
                                                     ↓
                                                 AdminSetup
```

## Data Management

### Database Structure

Our Firestore database uses the following structure:

```
firestore/
│
├── admin/
│   ├── allowedEmails         # Document with array of admin emails
│   └── [sanitized_email]     # Individual admin documents 
│
└── registrations/
    └── [registration_id]     # Individual registration documents
```

### Admin Document Structure

```javascript
// allowedEmails document
{
  emails: ["admin@example.com", "another@example.com"],
  setupKey: "metaverse123",
  createdAt: Timestamp,
  lastUpdated: Timestamp
}

// Individual admin document
{
  email: "admin@example.com",
  role: "admin",
  setupKey: "metaverse123",
  createdAt: Timestamp
}
```

### Registration Document Structure

```javascript
{
  name: "User Name",
  email: "user@example.com",
  reg_number: "12345678",
  department: "Computer Science",
  contact_number: "1234567890",
  timestamp: Timestamp
}
```

### Customizing Admin Access

To add or remove admin users after initial setup:

1. Access the Admin Setup page through the dashboard
2. Enter the setup key, new admin email, and password
3. Click "Setup Admin Access"

Alternatively, you can:

1. Access the Firebase Console
2. Go to Firestore Database
3. Navigate to the `admin` collection and the `allowedEmails` document
4. Edit the `emails` array to add or remove email addresses

You can also update the hardcoded admin list in `firebase/config.js` for fallback access.

## Search and Export Functionality

### Search Implementation

The dashboard implements an advanced search with:

1. **Field-specific filtering**: Filter by name, email, registration number, etc.
2. **Text highlighting**: Highlighted search matches
3. **Empty state handling**: User-friendly messages for no results
4. **Clear button**: Quick way to reset the search

```javascript
// Search filtering logic
const filteredRegistrations = registrations.filter((reg) => {
  if (!searchTerm.trim()) return true;
  
  const term = searchTerm.toLowerCase().trim();
  
  if (searchCategory === "all") {
    // Search across all fields
    return (
      (reg.name || '').toLowerCase().includes(term) ||
      (reg.reg_number || '').toLowerCase().includes(term) ||
      (reg.email || '').toLowerCase().includes(term) ||
      (reg.department || '').toLowerCase().includes(term) ||
      (reg.contact_number || '').toLowerCase().includes(term)
    );
  } else {
    // Search in specific field
    return (reg[searchCategory] || '').toLowerCase().includes(term);
  }
});
```

### Export Functionality

The dashboard provides two export formats:

1. **CSV Export**: Creates a CSV file with registration data
2. **Excel Export**: Creates a TSV file that Excel can open

Both export methods follow the same general approach:
1. Filter registrations based on current search
2. Format data into the appropriate structure
3. Create a blob and trigger a download

```javascript
// CSV export example (simplified)
const downloadCSV = () => {
  const headers = ['Name', 'Registration Number', 'Email', 'Department', 'Contact', 'Date'];
  const data = filteredRegistrations.map(reg => [
    reg.name || '',
    reg.reg_number || '',
    reg.email || '',
    reg.department || '',
    reg.contact_number || '',
    reg.timestamp?.toDate().toLocaleString() || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `metaverse_registrations_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
};
```

## Deployment Considerations

When deploying the admin portal, consider:

1. **Environment Variables**: Set up Firebase configuration in environment variables
2. **Firebase Project Setup**: Enable Email/Password authentication in the Firebase console
3. **Initial Admin**: Create the first admin user manually or through the Firebase console
4. **Security Rules**: Deploy Firestore security rules to protect data
5. **Setup Key Protection**: Change the setup key for production

### Deployment Checklist

Before deploying to production:

- [ ] Update the setup key to a strong, unique value
- [ ] Set up environment variables on your hosting platform
- [ ] Create at least one admin user to ensure access
- [ ] Enable only necessary Firebase services to minimize costs
- [ ] Implement proper error logging for production

## Troubleshooting

### Common Issues and Solutions

1. **Authentication Loop**
   - **Symptom**: Continual redirects between login and dashboard
   - **Solution**: Ensure the `ProtectedRoute` component checks loading states correctly

2. **Admin Check Failure**
   - **Symptom**: User can authenticate but not access admin content
   - **Solution**: Verify Firestore documents and security rules

3. **Navigation Issues**
   - **Symptom**: Unable to navigate between dashboard and setup
   - **Solution**: Check component mounting/unmounting and path-aware redirects

4. **Search Problems**
   - **Symptom**: Search doesn't return expected results
   - **Solution**: Verify field mapping and case sensitivity handling

5. **"Missing or insufficient permissions" Error**
   - **Symptom**: Firestore operations fail with permission errors
   - **Solution**: Make sure:
     - You've updated the Firestore security rules correctly
     - For admin setup, you're using the correct setup key: `metaverse123`
     - For admin dashboard access, you're signed in with an approved admin email

6. **Authentication Errors**
   - **Symptom**: Unable to log in or create admin users
   - **Solution**:
     - Check the debug panel for detailed error messages
     - Verify that Email/Password authentication is properly configured in Firebase Console
     - Ensure your password meets Firebase's minimum requirements (at least 6 characters)
     - Ensure the `firebase/config.js` file has the correct Firebase configuration

7. **Email Not Recognized as Admin**
   - **Symptom**: Successfully authenticated but denied admin access
   - **Solution**:
     - Check that your email is in the `admin/allowedEmails` document in Firestore
     - Alternatively, your email should be in the hardcoded admin list in the `firebase/config.js` file
     - Make sure you're signing in with exactly the same email that was added during admin setup

### Debug Panel

The admin portal includes a debug panel in the login component that shows:
- Authentication state changes
- Admin status checks
- Firestore operations
- Redirection actions

This helps diagnose issues during development and troubleshooting.

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling Guide](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)

---

## Conclusion

The Metaverse Club admin portal demonstrates a secure, scalable approach to building admin interfaces using Firebase. By combining Firebase Authentication, Firestore, and React, we've created a system that:

1. Provides secure authentication and authorization
2. Offers flexible admin user management
3. Delivers powerful data visualization and export tools
4. Uses modern UI/UX patterns for a responsive experience

The multi-layered security approach ensures that sensitive registration data remains protected while providing administrators with the tools they need to manage the platform effectively.
