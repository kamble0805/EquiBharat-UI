"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserData {
    id?: string;
    name?: string;
    username?: string;
    email: string;
    phone?: string;
    role?: 'user';
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: UserData | null;
    login: (userData: UserData) => void;
    logout: () => void;
    updateUser: (updates: Partial<UserData>) => void;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Persistence logic
    useEffect(() => {
        const savedLoggedIn = localStorage.getItem('isLoggedIn');
        const savedUser = localStorage.getItem('user');

        if (savedLoggedIn === 'true') {
            setIsLoggedIn(true);
        }
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn.toString());
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [isLoggedIn, user]);

    const login = (userData: UserData) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    const updateUser = (updates: Partial<UserData>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);


    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser, isAuthModalOpen, openAuthModal, closeAuthModal }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
