import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import * as api from '../services/apiService';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (productId: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getProducts();
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addProduct = async (product: Omit<Product, 'id'>) => {
        try {
            const newProduct = await api.createProduct(product);
            setProducts(prev => [newProduct, ...prev]);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const returnedProduct = await api.updateProduct(updatedProduct);
            setProducts(prev => prev.map(p => p.id === returnedProduct.id ? returnedProduct : p));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteProduct = async (productId: number) => {
        try {
            await api.deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };
    
    const value = { products, addProduct, updateProduct, deleteProduct, loading, error };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProduct = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};
