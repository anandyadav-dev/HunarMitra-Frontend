import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                loading: false
            }));
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
                latitude,
                longitude,
                error: null,
                loading: false
            });
            console.log("Location fetched:", latitude, longitude);
        };

        const handleError = (error) => {
            setLocation(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            console.error("Location error:", error.message);
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }, []);

    return (
        <LocationContext.Provider value={location}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    return useContext(LocationContext);
};
