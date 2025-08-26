import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../services/apiService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token and user in local storage on initial load
        try {
            const storedToken = localStorage.getItem('umkm-token');
            const storedUser = localStorage.getItem('umkm-user');
            if (storedToken && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('umkm-user');
            localStorage.removeItem('umkm-token');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUserAuth = (authData: { user: User; token: string }) => {
        localStorage.setItem('umkm-user', JSON.stringify(authData.user));
        localStorage.setItem('umkm-token', authData.token);
        setUser(authData.user);
    };

    // Live login
    const login = async (email: string, pass: string): Promise<void> => {
        const authData = await loginUser(email, pass);
        handleUserAuth(authData);
    };

    // Live register
    const register = async (name: string, email: string, pass: string): Promise<void> => {
        const authData = await registerUser(name, email, pass);
        handleUserAuth(authData);
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('umkm-user');
        localStorage.removeItem('umkm-token');
        setUser(null);
    };

    const value = { user, loading, login, logout, register };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
