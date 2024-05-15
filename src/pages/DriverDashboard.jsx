import React, { useState } from 'react';
import { DriverNavbar, Dashboard , MaintenanceForm, UserProfile,DriverFinanceTracking} from '../components/driver';
import PastTripsTable from '../components/driver/PastTripsTable';
import useAxiosGet from "../hooks/useAxiosGet"


const DriverDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  
  // Fetch past trips data
  const { data: pastTrips, error, isLoading, refetch } = useAxiosGet('/hire/getallpasttrips'); 

  return (
    <div>
      <DriverNavbar setActiveComponent={setActiveComponent} />
      <div className="container mx-auto p-4">
        {activeComponent === 'dashboard' && <Dashboard />}
        {activeComponent === 'pastTrips'  && <PastTripsTable pastTrips={pastTrips} isLoading={isLoading} error={error} refetch={refetch} />}
        {activeComponent === 'maintenance' && <MaintenanceForm /> }
        {activeComponent === 'profile' && <UserProfile /> }
        {activeComponent === 'DriverFinanceTracking' && <DriverFinanceTracking /> }
      </div>
    </div>
  );
};

export default DriverDashboard;
