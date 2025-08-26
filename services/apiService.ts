
import { Product, Customer, Transaction, User } from '../types';

const BASE_URL = 'http://localhost:3001/api'; // Standard local backend port

const getAuthToken = (): string | null => {
    return localStorage.getItem('umkm-token');
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// --- Auth ---
export const loginUser = (email: string, pass: string) => 
    apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
    });

export const registerUser = (name: string, email: string, pass: string) => 
    apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password: pass }),
    });


// --- Products ---
export const getProducts = (): Promise<Product[]> => apiFetch('/products');
export const createProduct = (productData: Omit<Product, 'id'>) => 
    apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
export const updateProduct = (product: Product) => 
    apiFetch(`/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    });
export const deleteProduct = (productId: number) => 
    apiFetch(`/products/${productId}`, {
        method: 'DELETE',
    });


// --- Customers ---
export const getCustomers = (): Promise<Customer[]> => apiFetch('/customers');
export const createCustomer = (customerData: Omit<Customer, 'id' | 'memberSince'>) => 
    apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
    });
export const updateCustomer = (customer: Customer) => 
    apiFetch(`/customers/${customer.id}`, {
        method: 'PUT',
        body: JSON.stringify(customer),
    });
export const deleteCustomer = (customerId: number) => 
    apiFetch(`/customers/${customerId}`, {
        method: 'DELETE',
    });

// --- Transactions ---
export const getTransactions = (): Promise<Transaction[]> => apiFetch('/transactions');
export const createTransaction = (transactionData: Omit<Transaction, 'id'>) => 
    apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
    });
