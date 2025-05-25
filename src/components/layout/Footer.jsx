import React from "react";

export function Footer() {
  return (
    <footer className="bg-blue-200 text-black py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-black-600">Metaverse</h3>
            <p className="text-black-300">
              Join our community and be part of something extraordinary.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-black-600">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-black-900 hover:text-white transition-colors duration-300"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/join-club"
                  className="text-black-300 hover:text-white transition-colors duration-300"
                >
                  Joins
                </a>
              </li>
              <li>
                <a
                  href="/members"
                  className="text-black-300 hover:text-white transition-colors duration-300"
                >
                  Members
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-black-300 hover:text-white transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  className="text-black-300 hover:text-white transition-colors duration-300"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="text-black-300 hover:text-white transition-colors duration-300"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white-600">Contact Us</h3>
            <p className="text-black-300 mb-3">
              <a href="mailto:info@Metaverse.com">Metaverse.lpu@gmail.com</a>
            </p>
            <p className="text-black-300 mb-3">
              <a href="https://www.instagram.com/metaverse_official00/#" className="hover:text-white">
                Instagram-: @metaverse_official00
              </a>
            </p>
            <address className="text-black-300 not-italic">
              Division of Student Welfare, Lovely Professional University, Jalandhar - Delhi G.T. Road,<br />
              Phagwara, Punjab (India) - 144411
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-Black-700 text-center">
          <p className="text-black-300">
            &copy; {new Date().getFullYear()} Metaverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
