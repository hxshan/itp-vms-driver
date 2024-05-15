import React from 'react';
import  { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import axios from '../../api/axios';
import { FaTimes } from 'react-icons/fa';

const TripDetailsPopup = ({ showDetails, toggleDetails, trip }) => {
  const [updateResponse, updateError, updateLoading, updateAxiosFetch] = useAxios();
  if (!showDetails) return null;


  const updatedTrip = {
    ...trip,
    hireStatus: "Cancelled"
  };
  const handleCancelTrip = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this trip?");
    if (confirmCancel) {
      await updateAxiosFetch({
        axiosInstance: axios,
        method: 'PATCH',
        url: `/hire/driverEdit/${trip._id}/`,
        requestConfig: {
          data: updatedTrip,
        },
      });
      console.log('Cancel trip clicked');
      
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-800 max-w-4xl relative">
        <FaTimes className="absolute top-0 right-0 m-4 text-gray-800 cursor-pointer hover:text-gray-700" onClick={toggleDetails} />
        <p className="text-xl mb-4 text-gray-800">{new Date(trip.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - {trip.startTime}</p>
        <div className="mb-7">
          <p className="text-2xl font-semibold">{trip.startPoint.city} - {trip.endPoint} {trip.airCondition? '(AC)' : '(Non AC)'}</p>
        </div>
        <div className="flex mb-5">
          <div className="mr-8">
            <p className="text-lg text-gray-500 mb-2">Status</p>
            <p>{trip.hireStatus}</p>
          </div>
          <div>
            <p className="text-lg text-gray-500 mb-2">Driver</p>
            <p>{trip.driver.firstName}</p>
          </div>
        </div>
        <div className="flex mb-5">
          <div className="mr-12">
            <p className="text-lg text-gray-500 mb-2">Start Point</p>
            <p>{trip.startPoint.no},{trip.startPoint.street}, {trip.startPoint.city}</p>
          </div>
          <div className="mr-12">
            <p className="text-lg text-gray-500 mb-2">End Point</p>
            <p>{trip.endPoint}</p>
          </div>
          <div className="mr-12">
            <p className="text-lg text-gray-500 mb-2">Roundtrip</p>
            <p>{trip.roundTrip ? 'Yes' : 'No'}</p>
          </div>
          <div className="mr-12">
            <p className="text-lg text-gray-500 mb-2">Air Condition</p>
            <p>{trip.airCondition ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-lg text-gray-500 mb-2">Passenger Count</p>
            <p>{trip.passengerCount}</p>
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xl font-semibold mb-2">Customer Details</p>
          <div className="flex">
            <div className="mr-8">
              <p className="text-lg text-gray-500 mb-2">Name</p>
              <p>{trip.cusName}</p>
            </div>
            <div className="mr-8">
              <p className="text-lg text-gray-500 mb-2">Mobile</p>
              <p>{trip.cusMobile}</p>
            </div>
            <div className="mr-8">
              <p className="text-lg text-gray-500 mb-2">NIC</p>
              <p>{trip.cusNic}</p>
            </div>
            <div>
              <p className="text-lg text-gray-500 mb-2">Email</p>
              <p>{trip.cusEmail}</p>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xl font-semibold mb-2">Estimated Details</p>
          <div className="flex">
            <div className="mr-8">
              <p className="text-lg text-gray-500 mb-2">Estimated Distance</p>
              <p>{trip.estimatedDistance}</p>
            </div>
            <div>
              <p className="text-lg text-gray-500 mb-2">Estimated Fare</p>
              <p>{trip.estimatedTotal}</p>
            </div>
          </div>
        </div>
        {trip.hireStatus === 'Completed' && (
          <div className="mb-5">
            <p className="text-xl font-semibold mb-2">Actual Details:</p>
            <div className="flex">
              <div className="mr-8">
                <p className="text-lg text-gray-500 mb-2">Actual Distance</p>
                <p>{trip.actualDistance} Km </p>
              </div>
              <div className="mr-8">
                <p className="text-lg text-gray-500 mb-2">Actual Duration</p>
                <p>{trip.actualTimeTaken}</p>
              </div>
              <div>
                <p className="text-lg text-gray-500 mb-2">Actual Fare</p>
                <p>{trip.finalTotal}</p>
              </div>
            </div>
          </div>
        )}
        {(trip.hireStatus !== 'Cancelled' && trip.hireStatus !== 'Completed') && (
          <button className="absolute bottom-0 right-0 m-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-gray-700" onClick={handleCancelTrip}>Cancel Trip</button>
        )}
      </div>
    </div>
  );
};

export default TripDetailsPopup;
