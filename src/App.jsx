import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DriverDashboard, TripPage,Login } from "./pages";

function App() {

  return (
    <main>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/TripPage" element={<TripPage />} />
      </Routes>
    </main>
  );
}

export default App;
