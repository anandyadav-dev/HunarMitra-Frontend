import apiClient from './client';

export const requestOTP = async (phone, role) => {
    try {
        const response = await apiClient.post('auth/request-otp/', { phone, role });
        return response.data;
    } catch (error) {
        console.error("Error requesting OTP:", error);
        throw error.response?.data || { message: "Network error" };
    }
};

export const verifyOTP = async (requestId, otp) => {
    try {
        const response = await apiClient.post('auth/verify-otp/', {
            request_id: requestId,
            otp: otp
        });
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error.response?.data || { message: "Invalid OTP" };
    }
};
