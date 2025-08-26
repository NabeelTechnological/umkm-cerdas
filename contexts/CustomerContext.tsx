import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Customer } from '../types';
import * as api from '../services/apiService';

interface CustomerContextType {
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'memberSince'>) => Promise<void>;
    updateCustomer: (customer: Customer) => Promise<void>;
    deleteCustomer: (customerId: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getCustomers();
                setCustomers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);


    const addCustomer = async (customer: Omit<Customer, 'id' | 'memberSince'>) => {
        try {
            const newCustomer = await api.createCustomer(customer);
            setCustomers(prev => [newCustomer, ...prev]);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateCustomer = async (updatedCustomer: Customer) => {
         try {
            const returnedCustomer = await api.updateCustomer(updatedCustomer);
            setCustomers(prev => prev.map(c => c.id === returnedCustomer.id ? returnedCustomer : c));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteCustomer = async (customerId: number) => {
        try {
            await api.deleteCustomer(customerId);
            setCustomers(prev => prev.filter(c => c.id !== customerId));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };
    
    const value = { customers, addCustomer, updateCustomer, deleteCustomer, loading, error };

    return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export const useCustomer = (): CustomerContextType => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
};
