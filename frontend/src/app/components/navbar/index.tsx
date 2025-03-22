import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="font-montserrat bg-white w-full h-16 flex items-center border-b border-gray-200 sticky top-0">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        
        <div className="flex items-center space-x-2">
          <Link href="/">
            <img
              src="/logo.svg"
              alt="Thought Mirror Logo"
              className="h-8 w-8 cursor-pointer"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-gray-800">
          <li>
            <Link href="/pages/about" className="hover:text-blue-500 transition-colors">
              about
            </Link>
          </li>
          <li>
            <Link href="/pages/journal" className="hover:text-blue-500 transition-colors">
              journal
            </Link>
          </li>
          <li>
            <Link href="/pages/dashboard" className="hover:text-blue-500 transition-colors">
              dashboard
            </Link>
          </li>
          <li>
            <Link href="/pages/login" className="hover:text-blue-500 transition-colors">
              login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;