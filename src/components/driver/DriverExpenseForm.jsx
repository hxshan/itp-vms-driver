import React, { useState , useEffect} from "react";
import useAxios from "../../hooks/useAxios";
import axios from "../../api/axios";

const DriverExpenseForm = ({ trip }) => {
  const [expenseData, setExpenseData] = useState({
    date: new Date(),
    time: "",
    tripId: trip._id,
    recordedBy: trip.driver.firstName,
    vehicle: trip.vehicle._id,
    category: "",
    status: "Pending",
      notes: "",
      odometerReading: 0,
      fuelType: "",
      fuelQuantity: 0,
      fuelPricePerUnit: 0,
      totalFuelPrice: 0,
      maintenanceDescription: "",
      serviceProvider: "",
      invoiceNumber: "",
      maintenanceCost: 0,
      insuaranceProvider: "",
      policyNumber: "",
      premiumAmount: 0,
      licenseType: "",
      otherLicensingDescription: "",
      licenseCost: 0,
      driverName: null,
      hoursWorked: 0,
      hourlyRate: 0,
      totalEarning: 0,
      otherDescription: "",
      otherAmount: 0,
      isReimbursement: false,
      reimbursementAmount:0,
      reimbursmentPerson:trip.driver._id,
      reimbursementStatus:"Pending"
    // Add other fields as needed
  });

  console.log(trip.driver._id)

  useEffect(() => {
    // Function to get current time in HH:mm format
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    // Set the current time in the expenseDetails state
    setExpenseData(prevState => ({
      ...prevState,
      time: getCurrentTime()
    }));
  }, []);


  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expensesData, expenseError, expenseLoading, expenseAxiosFetch] = useAxios();

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    // Check if the name is 'isReimbursement' and the value is 'false'
    if (name === 'isReimbursement' && value === 'false') {
      // Clear reimbursement-related fields
      setExpenseData(prevState => ({
        ...prevState,
        isReimbursement: false,
        reimbursementAmount: 0,
        reimbursmentPerson: trip.driver._id, // Clear the person if reimbursement is not applicable
        reimbursementStatus: 'Pending' // Reset the status if reimbursement is not applicable
      }));
    } else {
      // Update other fields as usual
      setExpenseData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    // Calculate total fuel price if fuel quantity or price per unit changes
    if (name === 'fuelQuantity' || name === 'fuelPricePerUnit') {
      const quantity = name === 'fuelQuantity' ? parseFloat(value) : expenseData.fuelQuantity;
      const pricePerUnit = name === 'fuelPricePerUnit' ? parseFloat(value) : expenseData.fuelPricePerUnit;
      const totalFuelPrice = quantity * pricePerUnit;
      
      // Update total fuel price in the state
      setExpenseData(prevState => ({
        ...prevState,
        totalFuelPrice: totalFuelPrice
      }));
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace the reimbursement person name with their ID before submitting
      const dataToSubmit = {
        ...expenseData,
        reimbursmentPerson: expenseData.isReimbursement ? trip.driver._id : expenseData.reimbursmentPerson
      };
  
      await expenseAxiosFetch({
        axiosInstance: axios,
        method: 'POST',
        url: '/expense/',
        requestConfig: {
          data: dataToSubmit
        }
      });
      setSuccessMessage("Expense submitted successfully");
      // Clear form fields on successful submission
      setExpenseData({
        ...expenseData,
        date: new Date(),
        time: "",
        tripId: trip._id,
        recordedBy: trip.driver.firstName,
        vehicle: trip.vehicle._id,
        category: "",
        status: "Pending",
          notes: "",
          odometerReading: 0,
          fuelType: "",
          fuelQuantity: 0,
          fuelPricePerUnit: 0,
          totalFuelPrice: 0,
          maintenanceDescription: "",
          serviceProvider: "",
          invoiceNumber: "",
          maintenanceCost: 0,
          insuaranceProvider: "",
          policyNumber: "",
          premiumAmount: 0,
          licenseType: "",
          otherLicensingDescription: "",
          licenseCost: 0,
          driverName: null,
          hoursWorked: 0,
          hourlyRate: 0,
          totalEarning: 0,
          otherDescription: "",
          otherAmount: 0,
          isReimbursement: false,
          reimbursementAmount:0,
          reimbursmentPerson:trip.driver._id,
          reimbursementStatus:"Pending"    
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      setErrorMessage("Failed to submit expense. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Expense Form</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Add form fields here */}
        {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Expense Category:</label>
        <select id="category" name="category" value={expenseData.category} onChange={handleExpenseChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">Select category</option>
          <option value="Fuel">Fuel</option>
          <option value="Maintenance and Repairs">Maintenance and Repairs</option>
          <option value="Tolls and Parking">Toll/Parking</option>
          <option value="Driver Hire Expense">Accomadation/Meals</option>
          <option value="Other">Other</option>
          {/* Other category options */}
        </select>
      </div>
      {expenseData.category === 'Fuel' && (
        <div>
          {/* Fuel Type Radio Buttons */}
          <div className="grid grid-cols-2 gap-x-4"></div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Fuel Type:</label>
            <div>
              <input type="radio" id="petrol" name="fuelType" value="Petrol" checked={expenseData.fuelType === 'Petrol'} onChange={handleExpenseChange} className="mr-2" />
              <label htmlFor="petrol" className="mr-4">Petrol</label>

              <input type="radio" id="diesel" name="fuelType" value="Diesel" checked={expenseData.fuelType === 'Diesel'} onChange={handleExpenseChange} className="mr-2" />
              <label htmlFor="diesel" className="mr-4">Diesel</label>

              <input type="radio" id="electric" name="fuelType" value="Electric" checked={expenseData.fuelType === 'Electric'} onChange={handleExpenseChange} />
              <label htmlFor="electric">Electric</label>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-4">
          <div className="mb-4">
            <label htmlFor="odometer" className="block text-gray-700 text-sm font-bold mb-2">Odometer/Mileage:</label>
            <input type="number" id="odometerReading" name="odometerReading" value={expenseData.odometerReading} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {/* Fuel Quantity */}
          
          <div className="mb-4">
            <label htmlFor="fuelQuantity" className="block text-gray-700 text-sm font-bold mb-2">Fuel Quantity:</label>
            <input type="number" id="fuelQuantity" name="fuelQuantity" value={expenseData.fuelQuantity} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {/* Fuel Price Per Unit */}
          <div className="mb-4">
            <label htmlFor="fuelPricePerUnit" className="block text-gray-700 text-sm font-bold mb-2">Fuel Price Per Unit:</label>
            <input type="number" id="fuelPricePerUnit" name="fuelPricePerUnit" value={expenseData.fuelPricePerUnit} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {/* Total Price (calculated dynamically) */}
          <div className="mb-4">
            <label htmlFor="totalPrice" className="block text-gray-700 text-sm font-bold mb-2">Total Price:</label>
            <input type="number" id="totalPrice" name="totalFuelPrice" value={expenseData.totalFuelPrice} readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>
        </div>
      )}

      {/* Maintenance and Repair Details */}
      {expenseData.category === 'Maintenance and Repairs' && (
        <div>
          {/* Maintenance Description */}
          <div className="mb-4">
            <label htmlFor="maintenanceDescription" className="block text-gray-700 text-sm font-bold mb-2">Maintenance Description:</label>
            <input type="text" id="maintenanceDescription" name="maintenanceDescription" value={expenseData.maintenanceDescription} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {/* Maintenance Service Provider */}
          <div className="mb-4">
            <label htmlFor="serviceProvider" className="block text-gray-700 text-sm font-bold mb-2">Service Provider:</label>
            <input type="text" id="serviceProvider" name="serviceProvider" value={expenseData.serviceProvider} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="grid grid-cols-2 gap-x-4">
          {/* Maintenance Invoice Number */}
          <div className="mb-4">
            <label htmlFor="invoiceNumber" className="block text-gray-700 text-sm font-bold mb-2">Invoice Number:</label>
            <input type="text" id="invoiceNumber" name="invoiceNumber" value={expenseData.invoiceNumber} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {/* Maintenance Cost */}
          <div className="mb-4">
            <label htmlFor="maintenanceCost" className="block text-gray-700 text-sm font-bold mb-2">Maintenance Cost:</label>
            <input type="number" id="maintenanceCost" name="maintenanceCost" value={expenseData.maintenanceCost} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>
        </div>
      )}
      {(expenseData.category === 'Other' || expenseData.category === 'Tolls and Parking'  || expenseData.category === 'Driver Hire Expense') && (
        <div>
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="otherDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <input type="text" id="otherDescription" name="otherDescription" value={expenseData.otherDescription} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="otherAmount" className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
            <input type="number" id="otherAmount" name="otherAmount" value={expenseData.otherAmount} onChange={handleExpenseChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>
      )}
      <div className="mb-4">
    <label htmlFor="isReimbursement" className="block text-gray-700 text-sm font-bold mb-2">Is Reimbursement:</label>
    <select
      id="isReimbursement"
      name="isReimbursement"
      value={expenseData.isReimbursement}
      onChange={handleExpenseChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value={false}>No</option>
      <option value={true}>Yes</option>
    </select>
  </div>
  {expenseData.isReimbursement && (
    <>
    
      <div className="mb-4">
        <label htmlFor="reimbursementAmount" className="block text-gray-700 text-sm font-bold mb-2">Reimbursement Amount:</label>
        <input
          type="number"
          id="reimbursementAmount"
          name="reimbursementAmount"
          value={expenseData.reimbursementAmount}
          onChange={handleExpenseChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
  <label htmlFor="reimbursmentPerson" className="block text-gray-700 text-sm font-bold mb-2">
    Reimbursement Person:
  </label>
  <input
    type="text"
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="reimbursmentPerson"
    name="reimbursmentPerson"
    value={trip.driver.firstName}
    readOnly  // <-- Add this attribute to make the input readonly
  />
</div>    
    </>
  )}


        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default DriverExpenseForm;
