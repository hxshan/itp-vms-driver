import React, { useState, useEffect } from 'react';
import { ReactToPrint } from 'react-to-print';
import useAxios from '../../hooks/useAxios';
import axios from '../../api/axios';
import { useAuthContext } from "../../hooks/useAuthContext";
import { jwtDecode } from 'jwt-decode';
import { TripSummary } from '.';

const PastTripTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, error, loading, axiosFetch] = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { user } = useAuthContext();
  const [userID, setUserID] = useState('');

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedTrip, setSelectedTrip] = useState(null); 
  const componentRef = React.createRef();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update currentDateTime every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const decodedToken = jwtDecode(user?.accessToken);
    setUserID(decodedToken?.UserInfo?.id);
  }, [user]);

  useEffect(() => {
    if(userID) {
      axiosFetch({
        axiosInstance: axios,
        method: "GET",
        url: `/hire/past/${userID}`, 
      });
    }
  }, [userID]);

  const canEditTrip = (endDate, endTime) => {
    const isoDate = endDate;
    const convertedDate = isoDate.substring(0, 10);
    const tripStartDateTime = new Date(convertedDate + 'T' + endTime);

    const oneHourInMillis = 60 * 60 * 1000;

    const differenceInMilliseconds = currentDateTime - tripStartDateTime;

    return differenceInMilliseconds < oneHourInMillis;
  };

  const columns = ["Date", "Start Time", "End Time", "Start Location", "End Location","Status", "Fare", "Actions"];

  const filteredData = data.filter((trip) =>
  new Date(trip.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase()) ||
  new Date(trip.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.endTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.startPoint.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.endPoint.toLowerCase().includes(searchTerm.toLowerCase())  ||
  trip.finalTotal.toString().includes(searchTerm.toLowerCase()) 


  
);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleViewSummary = (trip) => {
    setSelectedTrip(trip); // Set the selected trip when "View Summary" button is clicked
  };

  const handleCloseSummary = () => {
    setSelectedTrip(null); // Reset selectedTrip state when modal is closed
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // JSX for pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {pageNumbers.map((number) => (
            <li
              key={number}
              onClick={() => paginate(number)}
              className={`cursor-pointer px-3 py-1 rounded-lg border hover:bg-gray-200 ${
                currentPage === number ? 'bg-gray-300' : ''
              }`}
            >
              {number}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2 w-full md:w-auto"
          />
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2 md:mt-0 md:ml-2">Clear</button>
        </div>
        <ReactToPrint
          trigger={() => (
            <button className="bg-gray-400 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-md transition duration-300 ease-in-out mt-2 md:mt-0 md:ml-2">
              Generate Past Trip Table
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <div className="overflow-x-auto">
        <div ref={componentRef} className="print:border print:border-gray-800 print:border-4 print:p-8">

          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-400">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare (Rs)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((trip, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(trip.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(trip.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.startTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.endTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.startPoint.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.endPoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.hireStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.finalTotal}</td>
                    <td className="px-6 py-4 whitespace-nowrap print:hidden">
                      
                      <button onClick={() => handleViewSummary(trip)} className="bg-green-400 text-blackpy-1 px-2 rounded hover:bg-green-200">View Summary</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap" colSpan={columns.length}>No matching data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedTrip && (
        <TripSummary trip={selectedTrip} onClose={handleCloseSummary} />
      )}
      {renderPagination()}
    </div>
  );
};

export default PastTripTable;
