import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Transaction } from '../types';
import * as api from '../services/apiService';

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getTransactions();
                setTransactions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const newTransaction = await api.createTransaction(transaction);
            setTransactions(prev => [newTransaction, ...prev]);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };
    
    const value = { transactions, addTransaction, loading, error };

    return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export const useTransaction = (): TransactionContextType => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};
