import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

// Default admin credentials (in a real application, these would be stored securely on a server)
// For demonstration purposes only
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        if (isLoggedIn()) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        // Check credentials
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Set login session
            setLoggedIn(true);

            // Redirect to admin dashboard
            navigate('/admin');
        } else {
            setError('Invalid username or password');
            setPassword(''); // Clear password field
        }
    };

    // Set login status in localStorage
    const setLoggedIn = (status) => {
        if (status) {
            // Set a login token with expiration (24 hours)
            const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            const loginData = {
                token: Math.random().toString(36).substring(2, 15),
                expiration: expirationTime
            };
            localStorage.setItem('weatherDashboardAdminLogin', JSON.stringify(loginData));
        } else {
            // Remove login data
            localStorage.removeItem('weatherDashboardAdminLogin');
        }
    };

    // Check if user is logged in
    const isLoggedIn = () => {
        const loginData = localStorage.getItem('weatherDashboardAdminLogin');

        if (!loginData) {
            return false;
        }

        try {
            const data = JSON.parse(loginData);
            const currentTime = new Date().getTime();

            // Check if login has expired
            if (currentTime > data.expiration) {
                // Login expired, remove it
                localStorage.removeItem('weatherDashboardAdminLogin');
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Admin Login</h1>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            autoFocus
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                    {error && <div className="error-message">{error}</div>}
                </form>
                <a href="/" className="back-link">Back to Weather Dashboard</a>
            </div>
        </div>
    );
};

export default Login;