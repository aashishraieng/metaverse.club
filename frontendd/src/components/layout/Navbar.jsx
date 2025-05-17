import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // ✅ Import this

export function Navbar() {
  const navigate = useNavigate(); // ✅ Get the navigate function

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="logo h-10" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4 ml-auto">
            {window.location.pathname !== "/" ? (
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
              >
                <p style={{ fontSize: "2em" }}>&larr;</p> Back
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/members")}
                  className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
                >
                  Members
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/contact")}
                  className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
                >
                  Contact
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/join-club")}
                  className="text-gray-800 hover:text-pink-600 transition-colors duration-300"
                >
                  Join
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
