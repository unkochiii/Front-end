import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api, { getUserProfile } from '../services/api';
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('authToken');
            const storedUserId = await SecureStore.getItemAsync('userId');

            if (storedToken && storedUserId) {
                setToken(storedToken);

                // Récupère le profil complet
                const profileData = await getUserProfile(storedUserId);
                setUser({
                    _id: storedUserId,
                    username: profileData.account?.username,
                    fullname: profileData.fullname,
                    email: profileData.email,
                });
            }
        } catch (error) {
            console.log('Erreur chargement auth:', error);
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('userId');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            await SecureStore.setItemAsync('authToken', data.token);
            await SecureStore.setItemAsync('userId', data._id);

            setToken(data.token);
            setUser({
                _id: data._id,
                username: data.account.username,
            });

            router.replace('/(tabs)');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur de connexion');
        }
    };

    const signup = async (userData) => {
        try {
            const payload = {
                fullname: userData.fullname,
                username: userData.username,
                email: userData.email,
                password: userData.password,
                firstBookTitle: userData.firstBookTitle || '',
                firstBookAuthor: userData.firstBookAuthor || '',
                secondBookTitle: userData.secondBookTitle || '',
                secondBookAuthor: userData.secondBookAuthor || '',
                firstStyle: userData.favoriteGenres[0] || '',
                secondStyle: userData.favoriteGenres[1] || '',
                thirdStyle: userData.favoriteGenres[2] || '',
                birth: userData.birth || '',
                genre: userData.genre || '',
            };

            const { data } = await api.post('/auth/signup', payload);

            await SecureStore.setItemAsync('authToken', data.user.token);
            await SecureStore.setItemAsync('userId', data.user._id);

            setToken(data.user.token);
            setUser({
                _id: data.user._id,
                username: data.user.account.username,
            });

            router.replace('/(tabs)');
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erreur d'inscription");
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userId');
        setToken(null);
        setUser(null);
        router.replace('/(auth)/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
