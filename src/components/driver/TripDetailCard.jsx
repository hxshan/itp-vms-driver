import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaCar, FaTruck, FaBus, FaShuttleVan } from 'react-icons/fa';
import TripDetailsPopup from './TripDetailsPopup'; 

const TripDetailCard = ({ trip }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getVehicleIcon = (category) => {
    switch (category) {
      case 'car':
        return <FaCar className="text-gray-500 mr-2 h-6 w-6" />;
      case 'truck':
        return <FaTruck className="text-gray-500 mr-2 h-6 w-6" />;
      case 'bus':
        return <FaBus className="text-gray-500 mr-2 h-6 w-6" />;
      case 'van':
        return <FaShuttleVan className="text-gray-500 mr-2 h-7 w-7"  />;
      case 'lorry':
        return <FaTruck className="text-gray-500 mr-2 h-6 w-6" />;
      default:
        return <FaCar className="text-gray-500 mr-2 h-6 w-6" />;
    }
  };
  

  return (
    <div className="w-full ">
      <button className="bg-white rounded-md shadow-md hover:bg-gray-200 p-4 mb-4 ml-4 md:ml-10 mr-4 md:mr-14 flex flex-col md:flex-row items-center" onClick={toggleDetails}>
        {/* Date */}
        <div className="flex-grow md:flex-grow-2 flex items-center">
          <div className="flex items-center">
            <p className="text-gray-700">{new Date(trip.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Vertical Line */}
        <div className="border-l border-gray-500 h-auto md:h-8 mb-2 md:mb-0 md:mr-4 md:ml-4"></div>

        {/* Pickup and Destination */}
        <div className="flex items-center mb-2 md:mb-0 md:mr-4">
          <p className="text-lg font-semibold mr-2">{trip.startPoint.city}</p>
          <p className="text-lg font-semibold mr-2">-</p>
          <p className="text-lg font-semibold">{trip.endPoint}</p>
        </div>

        {/* Time and Car Details */}
        <div className="flex items-center">
          <div className="flex items-center mr-4 md:mr-6">
            <FaClock className="text-gray-600 mr-2 h-5 w-5" />
            <p className="text-sm md:text-base text-gray-600">{trip.startTime}</p>
          </div>
          <div className="flex items-center">
            {getVehicleIcon(trip.vehicle.category)}
            <p className="text-sm md:text-base text-gray-600">{trip.vehicle.vehicleRegister}</p>
          </div>
        </div>
      </button>

      {/* Trip details pop-up */}
      <TripDetailsPopup showDetails={showDetails} toggleDetails={toggleDetails} trip={trip} />
    </div>
  );
};

export default TripDetailCard;
