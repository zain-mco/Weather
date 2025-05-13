import React, { useState, useRef, useEffect } from 'react';
import './Weather.scss';

// Weather icons
const WeatherIcons = {
    Humidity: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14.5a4 4 0 01-4 4M5 14.5a4 4 0 014-4M14.5 19A4 4 0 0110 15M14.5 5A4 4 0 0110 9" />
        </svg>
    ),
    Wind: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    ),
    Pressure: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
    ),
    Feels: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    Search: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
};

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const weatherResultRef = useRef(null);
    
    // Auto-scroll to results when weather data is loaded
    useEffect(() => {
        if (weatherData && weatherResultRef.current) {
            // زيادة قيمة الإزاحة لضمان ظهور البطاقة بشكل كامل تحت الهيدر
            const yOffset = -50;
            // الانتقال إلى موضع منخفض أكثر عند عرض النتائج
            const y = weatherResultRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [weatherData]);

    const apiKey = "e26a8e45f18f358dcbddcb79798ac2f5";

    const getWeatherData = async () => {
        if (!city.trim()) {
            alert('Please enter a city name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`City not found (Status: ${response.status})`);
            }

            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="weather-container">
            {/* Search Section */}
            <div className="search-section">
                <h2 className="search-title">Check Weather Anywhere</h2>
                <p className="search-subtitle">Enter a city name to get current weather information</p>
                
                <div className="search-container">
                    <input
                        type="text"
                        className="city-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name..."
                        onKeyPress={(e) => e.key === 'Enter' && getWeatherData()}
                    />
                    <button 
                        className="search-btn" 
                        onClick={getWeatherData}
                    >
                        <WeatherIcons.Search />
                    </button>
                </div>
                
                {loading && <div className="loading">Loading weather data</div>}
                {error && <div className="error">{error}</div>}
            </div>
            
            {/* Results Section - Separate from search */}
            {weatherData && (
                <div className="results-section" ref={weatherResultRef}>
                    <div className="weather-info">
                        <div className="weather-card-header">
                            <h2 className="city-name">{weatherData.name}, {weatherData.sys.country}</h2>
                            
                            <img
                                className="weather-icon"
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                                alt={weatherData.weather[0].description}
                            />
                            
                            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
                            
                            <p className="weather-description">{weatherData.weather[0].description}</p>
                        </div>
                        
                        <div className="weather-card-body">
                            <div className="additional-info">
                                <div className="weather-param">
                                    <WeatherIcons.Feels />
                                    <span className="param-label">Feels Like</span>
                                    <span className="param-value">{Math.round(weatherData.main.feels_like)}°C</span>
                                </div>
                                <div className="weather-param">
                                    <WeatherIcons.Humidity />
                                    <span className="param-label">Humidity</span>
                                    <span className="param-value">{weatherData.main.humidity}%</span>
                                </div>
                                <div className="weather-param">
                                    <WeatherIcons.Wind />
                                    <span className="param-label">Wind</span>
                                    <span className="param-value">{Math.round(weatherData.wind.speed)} m/s</span>
                                </div>
                                <div className="weather-param">
                                    <WeatherIcons.Pressure />
                                    <span className="param-label">Pressure</span>
                                    <span className="param-value">{weatherData.main.pressure} hPa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;