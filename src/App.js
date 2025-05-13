import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Login from './pages/Login/Login';
import './styles/main.scss';

function App() {
    // Helper function to check if user is logged in
    const isLoggedIn = () => {
        try {
            const loginData = localStorage.getItem('weatherDashboardAdminLogin');
            if (!loginData) return false;
            
            const data = JSON.parse(loginData);
            const currentTime = new Date().getTime();
            
            return (currentTime <= data.expiration);
        } catch (error) {
            return false;
        }
    };

    return (
        <Router basename="/">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin" element={isLoggedIn() ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" />} /> {/* Catch all other routes */}
            </Routes>
        </Router>
    );
}

export default App;