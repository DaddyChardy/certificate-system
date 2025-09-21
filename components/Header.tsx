
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkClass = "text-white bg-blue-700";
  const inactiveLinkClass = "text-blue-100 hover:bg-blue-600 hover:text-white";

  return (
    <header className="bg-blue-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Seal_of_the_Philippines.svg/1200px-Seal_of_the_Philippines.svg.png" alt="Philippine Seal" className="h-12 w-12 mr-4" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">Seminar Management System</h1>
              <p className="text-sm text-blue-200">Republic of the Philippines</p>
            </div>
          </div>
          <nav className="flex space-x-2">
            <NavLink
              to="/register"
              className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Registration
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Admin Dashboard
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
