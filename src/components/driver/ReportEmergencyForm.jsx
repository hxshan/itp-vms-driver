import useAxios from "../../hooks/useAxios";
import axios from "../../api/axios";
import { useState } from "react";
import { ReactToPrint } from 'react-to-print';

const EmergencyReportForm = ({ trip }) => {
  const [emergencyDetails, setEmergencyDetails] = useState({
        caseType:'',
        caseTitle:'',
        location:'',
        timeOfIncident:  new Date(),
        licencePlate:trip.vehicle.vehicleRegister,
        driver:trip.driver._id,
        hire: trip._id,
        vehicle: trip.vehicle._id,
        passengerCount:trip.passengerCount,
        status: 'incomplete' ,
        incidentDescription:'',
        severity:''

  });

        
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [emergencyData, emergencyError, emergencyLoading, emergencyAxiosFetch] = useAxios();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmergencyDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await emergencyAxiosFetch({
        axiosInstance: axios,
        method: 'POST',
        url: '/caseFiles/driverCreateEmergency/',
        requestConfig: {
          data: emergencyDetails
        }
      });
      setSuccessMessage("Emergency report submitted successfully");
      // Clear form fields on successful submission
      setEmergencyDetails({
        ...emergencyDetails,
        caseTitle:'',
        location: '',
        incidentDescription: '',
        passengerCount: trip.passengerCount, // Reset passenger count to default
        severity:''
      });
      console.log(emergencyDetails)
    } catch (error) {
      console.error("Error creating emergency report:", error);
      setErrorMessage("Failed to submit emergency report. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Emergency Report Form</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="caseTitle" className="block font-medium text-gray-700">Case Title</label>
          <input
            type="text"
            id="caseTitle"
            name="caseTitle"
            value={emergencyDetails.caseTitle}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="caseType" className="block font-medium text-gray-700">Case Type</label>
          <select
            id="caseType"
            name="caseType"
            value={emergencyDetails.caseType}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          >
            <option value="">Select Case Type</option>
            <option value="accident">Accident</option>
            <option value="emergency">Emergency</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={emergencyDetails.location}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="incidentDescription"
            value={emergencyDetails.incidentDescription}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="severity" className="block font-medium text-gray-700">Severity</label>
          <select
            id="severity"
            name="severity"
            value={emergencyDetails.severity}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          >
            <option value="">Select Severity</option>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
        <div>
          <label htmlFor="passengerCount" className="block font-medium text-gray-700">Passenger Count</label>
          <input
            type="number"
            id="passengerCount"
            name="passengerCount"
            value={emergencyDetails.passengerCount}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default EmergencyReportForm;