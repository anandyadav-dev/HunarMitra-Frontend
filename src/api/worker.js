import apiClient from './client';

export const registerWorker = async (data) => {
    try {
        const response = await apiClient.post('workers/', data);
        return response.data;
    } catch (error) {
        console.error("Error registering worker:", error);
        throw error.response?.data || { message: "Registration failed" };
    }
};
