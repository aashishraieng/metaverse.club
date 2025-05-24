import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { WelcomePage } from "@/components/welcomepage";
import JoiningForm from "@/components/JoinForm.jsx";
import { Registration } from "@/components/sections/Registration";
import { RegistrationNow } from "@/components/sections/RegistrationNow";
import TermsAndConditions from "@/components/sections/tnc";
import RefundPolicy from "@/components/sections/rnc";
import ShippingPolicy from "@/components/sections/snd";
import Members from "@/components/sections/Members";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.css';
import { AdminLogin } from "@/components/sections/AdminLogin";
import { AdminDashboard } from "@/components/sections/AdminDashboard";
import { AdminSetup } from "@/components/sections/AdminSetup";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function App() {
  const location = useLocation();
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const direction = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePage(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const variants = {
    initial: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };
  
  return (
    <div className="min-h-screen bg-white">
      {showWelcomePage ? (
        <WelcomePage />
      ):(
        <>
          {!location.pathname.startsWith('/admin') && <Navbar />}
          
          <main className="bg-white min-h-screen overflow-hidden">
            <AnimatePresence mode="wait" custom={direction.current}>
              <motion.div 
                key={location.pathname} 
                custom={direction.current} 
                variants={variants} 
                initial="initial"
                animate="animate" 
                exit="exit" 
                transition={{duration:0.5,ease:"easeInOut"}}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <>
                      <Hero />
                      <Registration />
                      <Features />
                    </>
                  } />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/join-club" element={<JoiningForm />} />
                  <Route path="/register-now" element={<RegistrationNow />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/setup" element={
                    <ProtectedRoute>
                      <AdminSetup />
                    </ProtectedRoute>
                  } />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
          
          {!location.pathname.startsWith('/admin') && <Footer />}
        </>
      )}
    </div>
  );
}

export default App;
