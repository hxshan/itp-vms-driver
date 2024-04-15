import React, { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

const StartTripForm = ({ trip }) => {
  const [mileage, setMileage] = useState('');
  const [odometerImage, setOdometerImage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [pickLocationNo, setPickUpLocationNo] = useState(trip.startPoint.no);
  const [pickLocationStreet, setPickUpLocationStreet] = useState(trip.startPoint.street);
  const [pickLocationCity, setPickUpLocationCity] = useState(trip.startPoint.city);
  const [formError, setFormError] = useState('');

  const [vehicleData, Verror, Vloading, VaxiosFetch] = useAxios();
  const [updateResponse, updateError, updateLoading, updateAxiosFetch] = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStartDate(currentDate);
    setStartTime(currentTime);
  }, []);

  useEffect(() => {
    if (updateResponse && updateResponse.data) {
      console.log(updateResponse.data);
    }
  }, [updateResponse]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setOdometerImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!mileage || !startDate || !startTime || !pickLocationNo || !pickLocationStreet || !pickLocationCity) {
      setFormError('All fields are required');
      return;
    }

    if (parseInt(mileage) <= trip.vehicle.lastMileage) {
      setFormError('Mileage should be greater than the last recorded mileage');
      return;
    }

    setFormError('');
    const updatedTrip = {
      ...trip,
      startDate: startDate,
      startTime: startTime,
      intialOdometerReading: mileage,
      startPoint: { no: pickLocationNo, street: pickLocationStreet, city: pickLocationCity },
      hireStatus: "Ongoing"
    };

    const updateMileage = {
      ...trip.vehicle,
      lastMileage: mileage
    };

    await updateAxiosFetch({
      axiosInstance: axios,
      method: 'PATCH',
      url: `/hire/driverEdit/${trip._id}/`,
      requestConfig: {
        data: updatedTrip,
      },
    });

    await VaxiosFetch({
      axiosInstance: axios,
      method: 'PATCH',
      url: `/vehicle/mileage/${trip.vehicle._id}/`,
      requestConfig: {
        data: updateMileage,
      },
    });

    if (vehicleData) {
      console.log('Mileage updated')
    }

    if (updateResponse) {
      alert("successfully updated");
      navigate('/driver/tripPage', { state: { trip: updatedTrip } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="pickupLocationNo" className="block text-sm font-medium text-gray-700">
          Pickup Location No:
        </label>
        <input
          type="text"
          id="pickupLocationNo"
          value={pickLocationNo}
          onChange={(e) => setPickUpLocationNo(e.target.value)}
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pickupLocationStreet" className="block text-sm font-medium text-gray-700">
          Pickup Location Street:
        </label>
        <input
          type="text"
          id="pickupLocationStreet"
          value={pickLocationStreet}
          onChange={(e) => setPickUpLocationStreet(e.target.value)}
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pickupLocationCity" className="block text-sm font-medium text-gray-700">
          Pickup Location City:
        </label>
        <input
          type="text"
          id="pickupLocationCity"
          value={pickLocationCity}
          onChange={(e) => setPickUpLocationCity(e.target.value)}
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Destination:
        </label>
        <input
          type="text"
          id="destination"
          value={trip.endPoint}
          readOnly
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
          Vehicle:
        </label>
        <input
          type="text"
          id="vehicle"
          value={`${trip.vehicle.vehicleRegister}`}
          readOnly
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
          Starting Mileage:
        </label>
        <input
          type="number"
          id="mileage"
          value={trip.intialOdometerReading}
          onChange={(e) => setMileage(e.target.value)}
          required
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          readOnly
          required
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
          Start Time:
        </label>
        <input
          type="time"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          readOnly
          required
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="odometerImage" className="block text-sm font-medium text-gray-700">
          Odometer Photo:
        </label>
        <input
          type="file"
          id="odometerImage"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {formError && <p className="text-red-500">{formError}</p>}
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Start Trip
      </button>
    </form>
  );
};

export default StartTripForm;
