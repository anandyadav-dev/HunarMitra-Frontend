import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        city: '',
        error: null,
        loading: true,
        permissionGranted: false
    });

    const requestLocation = () => {
        setLocation(prev => ({ ...prev, loading: true, error: null }));
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                loading: false
            }));
            return;
        }
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    };

    const fetchCityName = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.state_district || '';
                setLocation(prev => ({ ...prev, city }));
            }
        } catch (error) {
            console.error("Error fetching city name:", error);
        }
    };

    const handleSuccess = (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(prev => ({
            ...prev,
            latitude,
            longitude,
            error: null,
            loading: false,
            permissionGranted: true
        }));
        fetchCityName(latitude, longitude);
        console.log("Location fetched:", latitude, longitude);
    };

    const handleError = (error) => {
        setLocation(prev => ({
            ...prev,
            error: error.message,
            loading: false,
            permissionGranted: false
        }));
        console.error("Location error:", error.message);
    };

    useEffect(() => {
        // Automatically try to get location if permission was previously granted or just to check state
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                requestLocation();
            } else {
                setLocation(prev => ({ ...prev, loading: false }));
            }
        });
    }, []);

    const value = {
        ...location,
        requestLocation
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    return useContext(LocationContext);
};
