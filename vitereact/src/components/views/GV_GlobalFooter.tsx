import React from 'react';
import { Link } from 'react-router-dom';

const GV_GlobalFooter: React.FC = () => {
  // Explicit type annotations for clarity and future extensibility
  const termsOfServiceURL = "https://example.com/terms-of-service";
  const privacyPolicyURL = "https://example.com/privacy-policy";

  const externalURLs = [
    {
      label: "Terms of Service",
      href: termsOfServiceURL,
    },
    {
      label: "Privacy Policy",
      href: privacyPolicyURL,
    },
  ];

  return (
    <>
      {/* Persistent Global Footer Styled with Tailwind CSS */}
      <footer className="fixed bottom-0 w-full bg-gray-800 text-gray-300 text-sm p-4 flex flex-col md:flex-row justify-between items-center">
        {/* Legal Links Section */}
        <div className="flex gap-4">
          {externalURLs.map(({ label, href }, index) => (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-100 transition duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Optional Social Media Links Section */}
        {/* Uncomment and extend if social media links are applicable */}
        {/* <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.686 1.797-1.563 2.457-2.549z"></path>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.389-1.831.654-2.828.775 1.077-.609 1.82-1.438 2.32-2.487-.905.575-1.894.988-2.958 1.243-.848-.93-2.035-1.49-3.402-1.49-2.572 0-4.658 2.171-4.658 4.783 0 .39.031.779.112 1.17v.313c-.61.324-1.238.533-1.948.533-.828 0-1.524-.285-2.06-.744.817.457 1.72.719 2.698.719.769-.216 1.54-.559 2.207-.892-.758 3.695-.925 7.544-1.144 7.98-.667-3.77-.824-7.81.404-10.609-1.763-.615-3.48-.954-5.33-.954-4.013 0-7.69 3.086-7.69 7.337 0 1.275.365 2.44 1.065 3.33-.611-.196-1.198-.584-1.682-.95-.058 1.772.572 3.306 1.76 4.095-.69 1.92-2.585 2.976-4.77 3.013-.346-.555-.31-1.451.299-2.266.95.606 2.126 1.05 3.494 1.05 4.49 0 7.34-4.08 7.34-7.327 0-.253-.076-.552-.191-.777.415 1.886 1.594 3.34 3.228 3.692-.392 3.251-1.3 5.832-2.84 6.805 2.764-1.7 4.245-4.786 4.245-8.46 0-1.81-.492-3.592-1.45-5.15v-.055z"></path>
            </svg>
          </a>
        </div> */

        {/* Copyright Notice */}
        <p className="mt-4 md:mt-0 text-center">
          &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default GV_GlobalFooter;