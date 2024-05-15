// DriverNavbar.js

import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode if not already imported

const DriverNavbar = ({ setActiveComponent, activeComponent }) => { // Add activeComponent prop
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    let decodedToken = {};
    if (user?.accessToken) {
      decodedToken = jwtDecode(user.accessToken);
      setId(decodedToken?.UserInfo?.id);
    }
  }, [user]);

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="h-8">
          {/* Add your logo/image here */}
        </div>
        <div className="flex justify-center space-x-12">
          <button
            onClick={() => setActiveComponent('dashboard')} // Update active component on click
            className={`hover:text-gray-300 ${activeComponent === 'dashboard' ? 'text-gray-300' : ''}`} // Apply active style
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveComponent('pastTrips')} // Update active component on click
            className={`hover:text-gray-300 ${activeComponent === 'pastTrips' ? 'text-gray-300' : ''}`} // Apply active style
          >
            Past Trips
          </button>
          <button
            onClick={() => setActiveComponent('maintenance')} // Update active component on click
            className={`hover:text-gray-300 ${activeComponent === 'maintenance' ? 'text-gray-300' : ''}`} // Apply active style
          >
            Maintenance
          </button>
        </div>
        {user?.accessToken && (
          <div className="relative">
            <button className="hover:text-gray-300 w-10 h-10" onClick={() => setMenuOpen(!menuOpen)}>
              <FaUser className="text-xl" />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 bg-gray-800 shadow-md border-black w-40 rounded-md">
                <button
                  className={`w-full px-4 py-2 border-b-2 border-gray-200 ${activeComponent === 'profile' ? 'text-gray-300' : ''}`} // Apply active style
                  onClick={() => {
                    setActiveComponent('profile'); // Update active component on click
                    
                  }}
                >
                  View Profile
                </button>
                <button
                  className={`w-full px-4 py-2 border-b-2 border-gray-200 ${activeComponent === 'DriverFinanceTracking' ? 'text-gray-300' : ''}`} // Apply active style
                  onClick={() => {
                    setActiveComponent('DriverFinanceTracking'); // Update active component on click
                    
                  }}
                >
                  Finance Tracker
                </button>
                <button
                  className="w-full px-4 py-2"
                  onClick={() => {
                    setActiveComponent('logout'); // Update active component on click
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DriverNavbar;
