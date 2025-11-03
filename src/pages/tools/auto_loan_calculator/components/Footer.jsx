import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      className="border-t border-neutral-200 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-neutral-100 rounded-sm"></div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">
                FinWorld
              </h3>
            </div>
            <p className="text-neutral-600 mb-4 max-w-md">
              Your trusted partner for auto loan calculations and financial solutions. 
              Make informed decisions with our professional tools and expert guidance.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>All 50 States</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@finworld.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-FIN-WORLD</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Available Nationwide</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm text-neutral-600">
              <a href="#" className="block hover:text-primary-500 transition-colors duration-200">
                Loan Calculator
              </a>
              <a href="#" className="block hover:text-primary-500 transition-colors duration-200">
                Refinance Options
              </a>
              <a href="#" className="block hover:text-primary-500 transition-colors duration-200">
                Auto Insurance
              </a>
              <a href="#" className="block hover:text-primary-500 transition-colors duration-200">
                Financial Resources
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-neutral-500">
              © 2024 FinWorld. All rights reserved. Built by Khurshid Ferdous for the FinWorld Project.
            </div>
            <div className="flex gap-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-primary-500 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors duration-200">
                Accessibility
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h5 className="font-semibold text-neutral-900 mb-2">Important Disclaimer</h5>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The calculations provided by this tool are estimates for informational purposes only. 
            Actual loan terms, rates, and payments may vary based on credit approval, lender policies, 
            and market conditions. Please consult with your lender or financial advisor for specific 
            loan details and terms. FinWorld is not a lender and does not provide financial advice. 
            All loan decisions should be made after reviewing official loan documents and terms.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;