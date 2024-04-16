import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DriverDashboard, TripPage,Login } from "./pages";

function App() {

  return (
    <main>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/driver">
        <Route index={true} element={<DriverDashboard />} />
        <Route path="TripPage" element={<TripPage />} />
       </Route>
      </Routes>
    </main>
  );
}

export default App;
