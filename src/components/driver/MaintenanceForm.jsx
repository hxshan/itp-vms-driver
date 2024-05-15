import  { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import axios from "../../api/axios";

const MaintenanceForm = () => {
  const [vehicleData, vehicleError, vehicleLoading, vehicleAxiosFetch, vehicleUpdatedAxiosFetch] = useAxios();
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    vrvehicleRegister: "",
    vrissue: "",
  });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    category: "",
    vrvehicleRegister: "",
    vrissue: "",
  });

  const getVehicleData = () => {
    vehicleAxiosFetch({
      axiosInstance: axios,
      method: "GET",
      url: `/vehicle/`,
    });
  };

  useEffect(() => {
    getVehicleData();
  }, []);

  useEffect(() => {
    if (vehicleData && vehicleData.vehicles) {
      const options = vehicleData.vehicles.map((vehicle) => ({
        value: vehicle._id,
        label: vehicle.category,
      }));
      setVehicleOptions(options);
    }
  }, [vehicleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    const errors = {};

    if (!formData.category) {
      errors.category = "Please select a vehicle category";
      valid = false;
    }

    if (!formData.vrvehicleRegister) {
      errors.vrvehicleRegister = "Please select a vehicle register number";
      valid = false;
    }

    if (!formData.vrissue) {
      errors.vrissue = "Please provide a description of the issue";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      setError("Please fix the form errors before submitting.");
      return;
    }

    try {
      const response = await vehicleUpdatedAxiosFetch({
        axiosInstance: axios,
        method: "POST",
        url: "/vehiclemaintain/driverMaintenanceRequest",
        data: { ...formData },
      });
      if(vehicleData){
        setError(null);
      setStatus("Maintenance request submitted successfully!");
      
      }
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatus(null);
        
      }, 3000);

      setFormData({ category: "", vrvehicleRegister: "", vrissue: "" });
    } catch (error) {
      setError("Failed to submit maintenance request. Please try again later.");
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Maintenance Request Form</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {status && <p className="text-green-500 mb-4">{status}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 font-medium">
            Vehicle Category:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
         
          >
            <option value="">Select Vehicle Category</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
            <option value="lorry">Lorry</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
          </select>
          {formErrors.category && <p className="text-red-500">{formErrors.category}</p>}
        </div>
        {formData.category
 && (
          <div className="mb-4">
            <label htmlFor="vehicleRegisterNumber" className="block mb-2 font-medium">
              Vehicle Register Number:
            </label>
            <select
              id="vehicleRegisterNumber"
              name="vrvehicleRegister"
              value={formData.vrvehicleRegister}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
             
            >
              <option value="">Select Vehicle Register Number</option>
              {vehicleData.vehicles
                .filter((vehicle) => vehicle.category === formData.category)
                .map((vehicle) => (
                  <option key={vehicle._id} value={vehicle.vehicleRegister}>
                    {vehicle.vehicleRegister}
                  </option>
                ))}
            </select>
            {formErrors.vrvehicleRegister && <p className="text-red-500">{formErrors.vrvehicleRegister}</p>}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-medium">
            Description:
          </label>
          <textarea
            id="description"
            name="vrissue"
            value={formData.vrissue}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          ></textarea>
          {formErrors.vrissue && <p className="text-red-500">{formErrors.vrissue}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MaintenanceForm;