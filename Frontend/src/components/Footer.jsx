import { FaBookOpen } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-3 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left - Logo + App Name */}
        <div className="flex items-center gap-2">
          <FaBookOpen className="text-white w-6 h-6" />
          <span className="text-lg font-semibold text-white">Scholarly</span>
        </div>

        {/* Center - Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">Catalog</a>
          <a href="#" className="hover:text-white transition">About</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>

        {/* Right - Copyright */}
        <div className="text-sm text-gray-400 text-center md:text-right">
          © {new Date().getFullYear()} Scholarly. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

