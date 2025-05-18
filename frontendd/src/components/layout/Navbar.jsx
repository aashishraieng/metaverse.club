import React, { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 relative">
        <div>
          <img src="/logo.png" alt="Logo" className="logo h-10" />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-600"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } sm:flex space-x-4 ml-auto flex-col sm:flex-row gap-4 sm:gap-0 absolute sm:static top-16 left-0 right-0 bg-white/90 sm:bg-transparent p-4 sm:p-0 border-t border-gray-300 sm:border-none`}
        >
          <button className="ghost">Members</button>
          <button className="ghost">Contact</button>
          <button className="ghost">Join</button>
        </div>
      </div>
    </nav>
  );
}
