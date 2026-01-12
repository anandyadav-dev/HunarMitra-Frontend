import axios from 'axios';

// Base configuration for API
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/', // Update if backend runs on a different port/host
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor to handle errors (e.g., token expiry)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.data?.code === 'token_not_valid')) {
            // Token expired or invalid
            console.warn("Session expired. Logging out.");
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            // Optional: Redirect to login or refresh page
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
