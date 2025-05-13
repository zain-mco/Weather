import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.scss';

const AdminDashboard = () => {
    const [sponsors, setSponsors] = useState([]);
    const [newSponsor, setNewSponsor] = useState({ name: '', logo: '', link: '' });
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }

        // Load sponsors
        loadSponsors();
    }, [navigate]);

    const loadSponsors = () => {
        try {
            const sponsorsData = localStorage.getItem('weatherDashboardSponsors');
            if (sponsorsData) {
                const parsedSponsors = JSON.parse(sponsorsData);
                if (Array.isArray(parsedSponsors)) {
                    setSponsors(parsedSponsors);
                }
            }
        } catch (error) {
            console.error('Error loading sponsors:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSponsor(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newSponsor.name || !newSponsor.logo || !newSponsor.link) {
            alert('Please fill in all fields');
            return;
        }

        // Check if we are in edit mode
        if (isEditing) {
            // Update the sponsor at the specified index
            const updatedSponsors = [...sponsors];
            updatedSponsors[editingSponsor] = newSponsor;
            localStorage.setItem('weatherDashboardSponsors', JSON.stringify(updatedSponsors));
            
            setSponsors(updatedSponsors);
            setNewSponsor({ name: '', logo: '', link: '' });
            setIsEditing(false);
            setEditingSponsor(null);
            
            alert('Sponsor updated successfully!');
        } else {
            // Add a new sponsor
            const updatedSponsors = [...sponsors, newSponsor];
            localStorage.setItem('weatherDashboardSponsors', JSON.stringify(updatedSponsors));

            setSponsors(updatedSponsors);
            setNewSponsor({ name: '', logo: '', link: '' });

            alert('Sponsor added successfully!');
        }
    };

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to delete this sponsor?')) {
            const updatedSponsors = [...sponsors];
            updatedSponsors.splice(index, 1);

            localStorage.setItem('weatherDashboardSponsors', JSON.stringify(updatedSponsors));
            setSponsors(updatedSponsors);
            
            // If currently editing this sponsor, cancel editing
            if (isEditing && editingSponsor === index) {
                setIsEditing(false);
                setEditingSponsor(null);
                setNewSponsor({ name: '', logo: '', link: '' });
            }
        }
    };
    
    const handleEdit = (index) => {
        setEditingSponsor(index);
        setIsEditing(true);
        setNewSponsor(sponsors[index]);
        
        // Scroll to the form
        document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
    };

    const handleLogout = () => {
        localStorage.removeItem('weatherDashboardAdminLogin');
        navigate('/login');
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
                localStorage.removeItem('weatherDashboardAdminLogin');
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Weather Dashboard Admin</h1>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

                <div className="admin-section">
                    <h2>Manage Sponsors</h2>

                    <form onSubmit={handleSubmit}>
                        <h3>{isEditing ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
                        <div className="form-group">
                            <label>Sponsor Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={newSponsor.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Sponsor Logo URL:</label>
                            <input
                                type="text"
                                name="logo"
                                value={newSponsor.logo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Sponsor Website Link:</label>
                            <input
                                type="text"
                                name="link"
                                value={newSponsor.link}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit">{isEditing ? 'Update Sponsor' : 'Add Sponsor'}</button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    className="cancel-btn" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingSponsor(null);
                                        setNewSponsor({ name: '', logo: '', link: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="sponsor-list-container">
                        <h3>Current Sponsors</h3>
                        <div className="sponsor-list">
                            {sponsors.length === 0 ? (
                                <p className="no-sponsors">No sponsors added yet.</p>
                            ) : (
                                sponsors.map((sponsor, index) => (
                                    <div className="sponsor-item" key={index}>
                                        <div className="sponsor-info">
                                            <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo-preview" />
                                            <div className="sponsor-details">
                                                <h4>{sponsor.name}</h4>
                                                <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                                                    {sponsor.link}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="sponsor-actions">
                                            <div className="action-buttons">
                                                <button className="edit-btn" onClick={() => handleEdit(index)}>
                                                    Edit
                                                </button>
                                                <button className="delete-btn" onClick={() => handleDelete(index)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="admin-footer">
                    <a href="/" className="back-link">Back to Weather Dashboard</a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;