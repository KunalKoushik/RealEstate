import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './Components/DarkModeContext';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Login from './Components/Login';
import DashboardPage from './Pages/DashboardPage';


const Admin = () => {
  const [accountType, setAccountType] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  // Check for token and decode it
  useEffect(() => {
    const token = Cookies.get("cookie");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setAccountType(decoded.accountType);
        setUserToken(token);

        // Optional: redirect to dashboard if on root path
        if (window.location.pathname === "/") {
          navigate("/admin/dashboard");
        }

      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return (
    <DarkModeProvider>
      <Routes>

  <Route path="/*" element={<DashboardPage />} />
</Routes>
    </DarkModeProvider>
  );
};

export default Admin;
