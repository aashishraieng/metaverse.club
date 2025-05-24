import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import Members from "@/components/sections/Members";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { WelcomePage } from "@/components/welcomepage";
import JoiningForm from "@/components/JoinForm.jsx";
import { Registration } from "@/components/sections/Registration";
import { RegistrationNow } from "@/components/sections/RegistrationNow";
import TermsAndConditions from "@/components/sections/tnc";
import RefundPolicy from "@/components/sections/rnc";
import ShippingPolicy from "@/components/sections/snd";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  // Check if welcome page has been shown before in this session
  const [showWelcomePage, setShowWelcomePage] = useState(() => {
    const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
    return hasShownWelcome !== 'true';
  });
  
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const direction = useRef(1);
  
  useEffect(() => {
    if (showWelcomePage) {
      const timer = setTimeout(() => {
        setShowWelcomePage(false);
        sessionStorage.setItem('hasShownWelcome', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomePage]);
  
  useEffect(() => {
    // Example of custom direction logic (you can customize this)
    if (prevPath.current === "/" && location.pathname === "/register-now") {
      direction.current = 1; // forward
    } else if (location.pathname === "/") {
      direction.current = -1; // back
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);
  
  const variants = {
    initial: (dir) => ({ opacity: 0, x: dir === 1 ? 200 : -200 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir === 1 ? -200 : 200 }),
  };
  
  return (
    <div className="min-h-screen bg-white">
      {showWelcomePage ? (
        <WelcomePage />
      ):(<>
          <Navbar />
          <main className="bg-white min-h-screen overflow-hidden">
            <AnimatePresence mode="wait" custom={direction.current}>
              <motion.div key={location.pathname} custom={direction.current} variants={variants} initial="initial"
                animate="animate" exit="exit" transition={{duration:0.5,ease:"easeInOut"}}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <>
                      <Hero />
                      <Registration />
                      <Features />
                    </>
                  } />
                  <Route path="/members" element={<Members />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/join-club" element={<JoiningForm />} />
                  <Route path="/register-now" element={<RegistrationNow />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
