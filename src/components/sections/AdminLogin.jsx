import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isAuthorizedAdmin } from "@/firebase/config";
import { Button } from '@/components/ui/button';

export function AdminLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [showDebug, setShowDebug] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Store intended destination
  const intendedPath = location.state?.intendedPath || "/admin/dashboard";
  
  useEffect(() => {
    const currentPath = location.pathname;
    console.log(`[AdminLogin] Component mounted at path: ${currentPath}`);
    setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Component mounted at path: ${currentPath}`);
    
    if (location.state?.intendedPath) {
      console.log(`[AdminLogin] Intended destination: ${location.state.intendedPath}`);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Intended destination: ${location.state.intendedPath}`);
    }
  }, [location]);

  // Check if user is already authenticated and is an admin
  useEffect(() => {
    console.log("[AdminLogin] Checking authentication state");
    setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Checking auth state at path: ${location.pathname}`);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(`[AdminLogin] Auth state changed: ${currentUser ? currentUser.email : 'No user'}`);
      setUser(currentUser);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Auth state changed: ${currentUser ? currentUser.email : 'No user'}`);
      
      if (currentUser) {
        try {
          // Check if the user is an admin
          const isAdmin = await checkAdminStatus(currentUser.email);
          setIsAdminUser(isAdmin);
          setAdminChecked(true);
          
          if (isAdmin) {
            console.log(`[AdminLogin] User ${currentUser.email} is an admin`);
            setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] User is admin`);
            
            // Only redirect if we're on the login page (not if we're on /admin/setup or another path)
            if (location.pathname === '/admin') {
              console.log(`[AdminLogin] On login page, redirecting to ${intendedPath}`);
              setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Redirecting to ${intendedPath}`);
              navigate(intendedPath, { replace: true });
            }
          } else {
            console.log(`[AdminLogin] User ${currentUser.email} is NOT an admin`);
            setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] User is NOT an admin, showing error`);
            setError('You do not have admin access. Please contact an administrator.');
          }
        } catch (error) {
          console.error("[AdminLogin] Error checking admin status:", error);
          setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Error checking admin status: ${error.message}`);
          setError(`Error checking admin status: ${error.message}`);
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in
        setIsAdminUser(false);
        setAdminChecked(true);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [navigate, location.pathname, intendedPath]);
  
  // Check if user is an admin through multiple methods
  const checkAdminStatus = async (email) => {
    console.log(`[AdminLogin] Checking admin status for ${email}`);
    setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Checking admin status for ${email}`);
    
    // Method 1: Check via hard-coded list (fastest)
    if (isAuthorizedAdmin(email)) {
      console.log(`[AdminLogin] ${email} is in the hardcoded admin list`);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] ${email} is in the hardcoded admin list`);
      return true;
    }
    
    try {
      // Method 2: Check the allowedEmails document
      const adminDoc = await getDoc(doc(db, "admin", "allowedEmails"));
      if (adminDoc.exists() && adminDoc.data().emails && adminDoc.data().emails.includes(email)) {
        console.log(`[AdminLogin] ${email} is in the Firestore allowedEmails list`);
        setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] ${email} is in the Firestore allowedEmails list`);
        return true;
      } else {
        console.log(`[AdminLogin] Not found in allowedEmails list or document doesn't exist`);
        setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Not found in allowedEmails list`);
      }
      
      // Method 3: Check individual admin document
      const sanitizedEmail = email.replace(/[.#$\/\[\]]/g, '_');
      const individualAdminDoc = await getDoc(doc(db, "admin", sanitizedEmail));
      if (individualAdminDoc.exists() && individualAdminDoc.data().email === email) {
        console.log(`[AdminLogin] ${email} has an individual admin document`);
        setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] ${email} has an individual admin document`);
        return true;
      }
      
      console.log(`[AdminLogin] ${email} is not an admin in any list`);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] ${email} is not an admin in any list`);
      return false;
    } catch (error) {
      console.error("[AdminLogin] Error checking Firestore for admin status:", error);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Error checking Firestore: ${error.message}`);
      throw error;
    }
  };

  // Handle Email/Password Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    console.log(`[AdminLogin] Login attempt with email: ${email}`);
    setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Login attempt with email: ${email}`);
    setLoading(true);
    setError(null);
    setStatusMessage("Signing in...");
    
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(`[AdminLogin] Authentication successful for ${userCredential.user.email}`);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Authentication successful`);
      
      // The useEffect hook will handle redirection after auth state changes
      setStatusMessage("Authentication successful, checking admin status...");
    } catch (error) {
      console.error("[AdminLogin] Authentication error:", error);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Authentication error: ${error.message}`);
      
      let errorMsg = 'Authentication failed.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please try again later.';
      } else {
        errorMsg = `Error: ${error.message}`;
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    console.log(`[AdminLogin] Signing out user`);
    try {
      await signOut(auth);
      console.log(`[AdminLogin] User signed out successfully`);
      setUser(null);
      setIsAdminUser(false);
      setError(null);
      setStatusMessage("Signed out successfully");
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] User signed out successfully`);
    } catch (error) {
      console.error("[AdminLogin] Sign out error:", error);
      setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Error signing out: ${error.message}`);
      setError(`Error signing out: ${error.message}`);
    }
  };

  // Determine if user is attempting to access a protected page
  const isAttemptingProtectedAccess = !!location.state?.intendedPath;
  const protectedPath = location.state?.intendedPath || "";
  
  return (
    <section className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-gray-400">Access the admin dashboard</p>
        </div>

        {isAttemptingProtectedAccess && (
          <div className="bg-blue-900 bg-opacity-20 border border-blue-900/50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-300">
              You're trying to access a protected page: <span className="font-mono">{protectedPath}</span>
            </p>
            <p className="text-sm text-blue-300 mt-1">
              Please log in with admin credentials to continue.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p>{statusMessage || "Loading..."}</p>
          </div>
        ) : user && isAdminUser ? (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <p className="mb-2">Signed in as {user.email}</p>
              <p className="text-green-500 mb-4">✓ Admin access verified</p>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/admin/dashboard')} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
                <Button onClick={handleSignOut} variant="destructive">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  Log In
                </Button>
              </div>
            </form>

            <p className="mt-6 text-sm text-gray-400 text-center">
              Admin setup is available from the dashboard after login.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Debug information panel - only visible during development */}
        {showDebug && (
          <div className="mt-6 p-3 bg-gray-850 border border-gray-700 rounded text-xs font-mono text-gray-400 overflow-auto max-h-64">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-300">Debug Information</h3>
              <button 
                onClick={() => setShowDebug(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                Hide
              </button>
            </div>
            <pre className="whitespace-pre-wrap">
              Path: {location.pathname}
              {debugInfo}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
} 