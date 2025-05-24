import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isAuthorizedAdmin } from '@/firebase/config';

export function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [checkedFirestore, setCheckedFirestore] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log(`[ProtectedRoute] Checking authentication for path: ${location.pathname}`);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log(`[ProtectedRoute] User authenticated: ${currentUser.email}`);
        setUser(currentUser);
        
        // Check if the user is an admin
        try {
          // First check the hardcoded list (fastest)
          if (isAuthorizedAdmin(currentUser.email)) {
            console.log(`[ProtectedRoute] Admin access granted via hardcoded list`);
            setIsAdmin(true);
            setLoading(false);
            setCheckedFirestore(true);
            return;
          }
          
          console.log(`[ProtectedRoute] Checking Firestore admin documents`);
          // Then check Firestore allowedEmails document
          const adminDoc = await getDoc(doc(db, "admin", "allowedEmails"));
          if (adminDoc.exists() && adminDoc.data().emails) {
            const adminEmails = adminDoc.data().emails;
            console.log(`[ProtectedRoute] Found admin emails in Firestore: ${adminEmails.length} entries`);
            
            if (adminEmails.includes(currentUser.email)) {
              console.log(`[ProtectedRoute] Admin access granted via Firestore allowedEmails`);
              setIsAdmin(true);
              setLoading(false);
              setCheckedFirestore(true);
              return;
            }
          } else {
            console.log(`[ProtectedRoute] No allowedEmails document found in Firestore`);
          }
          
          // Finally check individual admin document
          const sanitizedEmail = currentUser.email.replace(/[.#$\/\[\]]/g, '_');
          console.log(`[ProtectedRoute] Checking individual admin document for: ${sanitizedEmail}`);
          const individualAdminDoc = await getDoc(doc(db, "admin", sanitizedEmail));
          
          if (individualAdminDoc.exists() && individualAdminDoc.data().email === currentUser.email) {
            console.log(`[ProtectedRoute] Admin access granted via individual document`);
            setIsAdmin(true);
            setLoading(false);
            setCheckedFirestore(true);
            return;
          }
          
          // If we get here, user is not an admin
          console.log(`[ProtectedRoute] User ${currentUser.email} is not an admin`);
          setIsAdmin(false);
          setLoading(false);
          setCheckedFirestore(true);
        } catch (error) {
          console.error("[ProtectedRoute] Error checking admin status:", error);
          setIsAdmin(false);
          setLoading(false);
          setCheckedFirestore(true);
        }
      } else {
        console.log("[ProtectedRoute] No user authenticated");
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        setCheckedFirestore(true);
      }
    });
    
    // Set a timeout to prevent getting stuck in loading state
    const timeoutId = setTimeout(() => {
      if (loading && !checkedFirestore) {
        console.log("[ProtectedRoute] Timeout reached - forcing completion of auth check");
        setLoading(false);
      }
    }, 5000); // 5 seconds max wait
    
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [location.pathname, loading, checkedFirestore]);
  
  // Show loading spinner while checking
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p>Verifying access...</p>
          <p className="text-sm text-gray-400 mt-2">Checking admin credentials for {location.pathname}</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated or not admin
  if (!user || !isAdmin) {
    console.log(`[ProtectedRoute] Access denied for ${location.pathname}. User: ${user?.email || 'None'}, isAdmin: ${isAdmin}`);
    // Pass the current path as state so the login component knows where to redirect back
    return <Navigate to="/admin" state={{ intendedPath: location.pathname }} replace />;
  }
  
  // All checks passed, render children
  console.log(`[ProtectedRoute] Access granted to ${location.pathname} for ${user.email}`);
  return children;
} 