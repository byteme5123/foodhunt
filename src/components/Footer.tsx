import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600 flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by{' '}
          <a 
            href="https://github.com/surajanbudhathoki" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            Surajan Budhathoki
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;