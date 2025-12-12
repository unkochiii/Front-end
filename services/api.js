import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'https://site--en2versv0-backend--ftkq8hkxyc7l.code.run',
    timeout: 10000,
});

// Intercepteur : injecte automatiquement le token
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fonction pour récupérer le profil utilisateur
export const getUserProfile = async (userId) => {
    try {
        const { data } = await api.get(`/user/profile/${userId}`);
        return data.user;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
};

export default api;
