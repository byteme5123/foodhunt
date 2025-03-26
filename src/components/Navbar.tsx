import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <UtensilsCrossed className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Travel Nepal, Eat Local
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-600 hover:text-gray-900">
              <Search className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;