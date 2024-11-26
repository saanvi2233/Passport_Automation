// src/components/Navbar.js
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Passport Automation
        </Link>
        <div className="space-x-4">
          <Link to="/application-form" className="text-white">
            Apply
          </Link>
          <Link to="/track" className="text-white">
            Track Application
          </Link>
          <Link to="/applications" className="text-white">
            Application Review
          </Link>
          <Link to="/reports" className="text-white">
            Reports
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
