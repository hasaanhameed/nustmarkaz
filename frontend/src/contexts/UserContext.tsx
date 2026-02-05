import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, User } from '@/api/user';

interface UserContextType {
    user: User | null | undefined;
    isLoading: boolean;
    error: any;
    logout: () => void;
    refetchUser: () => void;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const logout = () => {
        localStorage.removeItem('access_token');
        queryClient.setQueryData(['user', 'me'], null);
        // Use clear() or invalidate queries to ensure a fresh state
        queryClient.invalidateQueries();
    };

    const isAuthenticated = !!user;

    return (
        <UserContext.Provider value={{
            user,
            isLoading,
            error,
            logout,
            refetchUser: refetch,
            isAuthenticated
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
