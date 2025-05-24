import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AdminSetup() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [user, setUser] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const SETUP_SECRET_KEY = 'metaverse123'; // Simple setup protection
  const auth = getAuth();

  // Track current user
  useEffect(() => {
    console.log("[AdminSetup] Checking current user");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(`[AdminSetup] Current user: ${currentUser?.email || 'None'}`);
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  const setupAdmin = async () => {
    if (secretKey !== SETUP_SECRET_KEY) {
      setStatus('Invalid setup key. Please enter the correct key to proceed.');
      return;
    }

    if (!adminEmail || !adminEmail.includes('@')) {
      setStatus('Please enter a valid email');
      return;
    }

    if (!adminPassword || adminPassword.length < 6) {
      setStatus('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setStatus('Setting up admin access...');

    try {
      // First, create a Firebase Authentication user
      let userCredential;
      
      try {
        userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        setStatus('Created admin user in Firebase Authentication');
      } catch (authError) {
        // If the user already exists, we can still proceed with Firestore setup
        if (authError.code === 'auth/email-already-in-use') {
          setStatus('Admin user already exists in Firebase Authentication. Proceeding with Firestore setup...');
        } else {
          throw authError; // Re-throw other auth errors
        }
      }

      // Reference to the admin collection in Firestore
      const adminCollectionName = 'admin'; // Using 'admin' instead of 'admins' to match existing code
      
      // Reference to the special allowedEmails document
      const allowedEmailsRef = doc(db, adminCollectionName, 'allowedEmails');
      
      // Check if the document exists
      const docSnap = await getDoc(allowedEmailsRef);
      
      if (docSnap.exists()) {
        // Document exists, update the emails array
        // Include the setup key for security rules validation
        await updateDoc(allowedEmailsRef, {
          emails: arrayUnion(adminEmail),
          setupKey: SETUP_SECRET_KEY, // Include the key for security rules
          lastUpdated: new Date()
        });
        setStatus(`Successfully added ${adminEmail} to admin list.`);
      } else {
        // Document doesn't exist, create it with the emails array
        await setDoc(allowedEmailsRef, {
          emails: [adminEmail],
          setupKey: SETUP_SECRET_KEY, // Include the key for security rules
          createdAt: new Date()
        });
        setStatus(`Created admin list with ${adminEmail}.`);
      }
      
      // Also create an individual admin document with additional metadata
      const adminDocRef = doc(db, adminCollectionName, adminEmail.replace(/[.#$\/\[\]]/g, '_'));
      await setDoc(adminDocRef, {
        email: adminEmail,
        role: 'admin',
        setupKey: SETUP_SECRET_KEY, // Include the key for security rules
        createdAt: new Date()
      });
      
      setStatus(`Setup complete! Admin user ${adminEmail} is now configured. They can log in at /admin with these credentials.`);
      setSuccessCount(prev => prev + 1);
      
      // Reset form after successful setup
      setAdminEmail('');
      setAdminPassword('');
      setSecretKey('');
      
    } catch (error) {
      console.error('Error setting up admin:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl shadow-2xl text-white max-w-md w-full p-8 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Admin Setup</h2>
            <p className="text-gray-400 mt-1">Create administrator accounts</p>
          </div>
          <Link to="/admin/dashboard">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-300">
              This page is only accessible to authenticated admin users. Use this form to add new admin users to the system.
            </p>
          </div>
        </div>
        
        <p className="mb-6 text-gray-300 text-sm">
          This utility will create an admin user with email/password authentication and grant admin access in Firestore.
        </p>

        {user && (
          <div className="bg-green-900/20 border border-green-900/50 p-3 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-300">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all focus:outline-none"
                placeholder="Choose a secure password"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">Must be at least 6 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Setup Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all focus:outline-none"
                placeholder="Enter setup key (metaverse123)"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">Required for security verification</p>
          </div>
        </div>
        
        <Button
          onClick={setupAdmin}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg transition-all flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Setting up...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Setup Admin Access
            </>
          )}
        </Button>
        
        {status && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={successCount} // Re-animate on new success
            className={`mt-6 p-4 rounded-lg ${status.includes('Error') 
              ? 'bg-red-900/20 border border-red-800/40' 
              : 'bg-green-900/20 border border-green-800/40'}`}
          >
            <div className="flex items-start">
              {status.includes('Error') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="text-sm">{status}</p>
            </div>
          </motion.div>
        )}
        
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Notes:
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
            <li>This creates both an authentication user and Firestore admin records</li>
            <li>The default setup key is "metaverse123"</li>
            <li>New admins can log in at <Link to="/admin" className="text-blue-400 hover:text-blue-300 transition-colors">
              /admin
            </Link> with their credentials</li>
            <li>Keep admin credentials secure</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
} 