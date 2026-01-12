import apiClient from './client';

export const registerContractor = async (contractorData) => {
    try {
        const response = await apiClient.post('contractors/', contractorData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
