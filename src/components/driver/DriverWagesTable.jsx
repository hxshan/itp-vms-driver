import React, { useState, useEffect } from 'react';
import { ReactToPrint } from 'react-to-print';
import useAxios from '../../hooks/useAxios';
import axios from '../../api/axios';
import { useAuthContext } from "../../hooks/useAuthContext";
import { jwtDecode } from 'jwt-decode';
import { TripSummary } from '.';

const DriverWagesTable = () => {
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
        url: `/expense/driverwage/${userID}`, 
      });
    }
  }, [userID]);

  console.log(data)

  const canEditTrip = (endDate, endTime) => {
    const isoDate = endDate;
    const convertedDate = isoDate.substring(0, 10);
    const tripStartDateTime = new Date(convertedDate + 'T' + endTime);

    const oneHourInMillis = 60 * 60 * 1000;

    const differenceInMilliseconds = currentDateTime - tripStartDateTime;

    return differenceInMilliseconds < oneHourInMillis;
  };

  const columns = ["Date", "Trip Detail", "Wages", "Status"];

  const filteredData = data.filter((trip) =>
  new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.tripId.startPoint.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.tripId.endPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
  trip.status.toLowerCase().includes(searchTerm.toLowerCase())  ||
  trip.totalEarning.toString().includes(searchTerm.toLowerCase()) 


  
);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  

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
    <div className="overflow-x-auto text-center ">
        <h3  className="text-2xl font-semibold ">Wages</h3>
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
            <button className="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-md transition duration-300 ease-in-out mt-2 md:mt-0 md:ml-2">
              Generate Wage
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div ref={componentRef} className="print:border print:border-gray-800 print:border-4 print:p-8">

        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black">
            <tr>
                <th className="px-6 py-3 border-r border-white text-center text-xs font-bold text-white uppercase tracking-wider"> Date</th>
                <th className="px-6 py-3 border-r border-white text-center text-xs font-bold text-white uppercase tracking-wider">Trip Details</th>
                <th className="px-6 py-3 border-r border-white text-center text-xs font-bold text-white uppercase tracking-wider">Wages</th>
                <th className="px-6 py-3 border-r border-white text-center text-xs font-bold text-white uppercase tracking-wider">Status</th>

              </tr>
            </thead>
            <tbody className="border-t border-gray-300">
              {currentItems.length > 0 ? (
                currentItems.map((trip, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2 whitespace-nowrap border-r border-gray-200            ">{new Date(trip.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    
                    <td className="px-6 py-2 whitespace-nowrap border-r border-gray-200">{trip.tripId.startPoint.city}-{trip.tripId.endPoint}</td>
                    <td className="px-6 py-2 whitespace-nowrap border-r border-gray-200">{trip.totalEarning}</td>
                    <td className="px-6 py-2 whitespace-nowrap border-r border-gray-200">{trip.status}</td>
                    
                    
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
      
      {renderPagination()}
    </div>
  );
};

export default DriverWagesTable;
