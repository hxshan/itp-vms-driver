import { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import axios from '../../api/axios';
import { FaCalendarAlt, FaCheckCircle  } from 'react-icons/fa';
import TripCard from './UpcomingTrip';
import TripDetailCard from './TripDetailCard';
import { useAuthContext } from "../../hooks/useAuthContext";
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const { user } = useAuthContext()
  const [pasTripData,pastTripError, pastTripLoading, pastTripAxiosFetch] = useAxios();

  const [tripData,tripError, tripLoading, tripAxiosFetch] = useAxios();


  const [userID,setUserID]=useState('')
 
  useEffect(() => {
    const decodedToken = jwtDecode(user?.accessToken);
    setUserID(decodedToken?.UserInfo?.id);
  }, [user]);
  
console.log(userID)
  
useEffect(() => {
  if(userID) {
    tripAxiosFetch({
      axiosInstance: axios,
      method: "GET",
      url: `/hire/driver/${userID}`,
      headers:{
        authorization:`Bearer ${user?.accessToken}`
      } // Use userID variable dynamically
    });
  }
}, [userID]);
console.log(tripData)

useEffect(() => {
  if(userID) {
    pastTripAxiosFetch({
      axiosInstance: axios,
      method: "GET",
      url: `/hire/past/${userID}`, 
    });
  }
}, [userID]);

useEffect(() => {
  if (tripData && tripData.length > 0) {
    const currentDate = new Date();
    const upcoming = tripData.filter(trip => {
      const isoDate = trip.startDate;
      const convertedDate = isoDate.substring(0, 10);
      const tripStartDateTime = new Date(`${convertedDate}T${trip.startTime}`);
      return ((tripStartDateTime >= currentDate && (trip.hireStatus === "Active") )|| trip.hireStatus === "Ongoing");
    });
    setUpcomingTrips(upcoming);
  }
}, [tripData]);

console.log(upcomingTrips)

  useEffect(() => {
    if (pasTripData && pasTripData.length > 0) {
    

      const past = [];

      pasTripData.forEach(trip => {
        
       if (
                 (trip.hireStatus === "Completed" || 
                  trip.hireStatus === "Ended" || 
                  trip.hireStatus === "Cancelled")) {
          past.push(trip);
      }
      
      });

      setPastTrips(past);
     
    }
  }, [pasTripData]);
  // Select the very next trip
  const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;



  return (
    <div className="container mx-auto">
      
        
      <div className="flex flex-col items-start ml-10 mt-4 ">
          <div>
            {nextTrip ? (
              <TripCard key={nextTrip._id} trip={nextTrip} /> 
            ) : (
              <p>No upcoming trips</p>
            )}
          </div>
     </div>
        
     <div className="flex flex-col lg:flex-row lg:justify-between">
  <div className="lg:w-1/2 lg:ml-10 mr-4">
    <div className="flex flex-col items-start mt-4 mb-4">
      <div className="flex items-center">
        <FaCalendarAlt className="text-gray-500 mr-2 h-5 w-5" />
        <h2 className="text-xl lg:text-2xl font-bold">Your Upcoming Trips</h2>
      </div>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 mt-2">
        {upcomingTrips.map((trip) => (
          <TripDetailCard key={trip._id} trip={trip} />
        ))}
      </div>
    </div>
  </div>

  <div className="lg:w-1/2 lg:ml-4 mt-4 lg:mt-0">
    <div className="flex flex-col items-start mt-4 mb-4">
      <div className="flex items-center">
        <FaCheckCircle  className="text-gray-500 mr-2 h-5 w-5" />
        <h2 className="text-xl lg:text-2xl font-bold">Your Past Trips</h2>
      </div>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 mt-2">
      {pastTrips.map((trip) => (
          <TripDetailCard trip={trip} key={trip._id} />
        ))}
      </div>
    </div>
  </div>
</div>


      
    </div>
  );
};

export default Dashboard;