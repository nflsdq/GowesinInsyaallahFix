import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import BikeList from "./pages/Bike/BikeList";
import BikeDetail from "./pages/Bike/BikeDetail";
import StationList from "./pages/Station/StationList";
import RentalDetail from "./pages/Rental/RentalDetail";
import ReturnBike from "./pages/Rental/ReturnBike";
import RentalHistory from "./pages/Rental/RentalHistory";
import Payment from "./pages/Payment/Payment";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, [localStorage.getItem("token"), localStorage.getItem("role")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className='app'>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/masuk'
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path='/daftar' element={<Register />} />
          <Route path='/sepeda' element={<BikeList />} />
          <Route path='/sepeda/:id' element={<BikeDetail />} />
          <Route path='/stasiun' element={<StationList />} />
          <Route path='/peminjaman/:id' element={<RentalDetail />} />
          <Route path='/pengembalian-sepeda' element={<ReturnBike />} />
          <Route
            path='/riwayat-peminjaman'
            element={
              role === "peminjam" ? <RentalHistory /> : <Navigate to='/' />
            }
          />
          <Route path='/pembayaran' element={<Payment />} />
          <Route
            path='/dashboard'
            element={role === "pemilik" ? <Dashboard /> : <Navigate to='/' />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
