import React, { useState, useEffect } from 'react';
import './Sponsors.scss';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        // Load sponsors from localStorage
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

        loadSponsors();

        // Listen for storage events
        const handleStorageChange = (event) => {
            if (event.key === 'weatherDashboardSponsors') {
                loadSponsors();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (sponsors.length === 0) {
        return null;
    }

    return (
        <div className="sponsors-section">
            <h2>Our Sponsors</h2>
            <div className="sponsors-container">
                {sponsors.map((sponsor, index) => (
                    <div className="sponsor" key={index} style={{ "--i": index + 1 }}>
                        <div className="sponsor-card">
                            <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
                            <h3 className="sponsor-name">{sponsor.name}</h3>
                            <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="sponsor-link">
                                Visit Website
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsors;