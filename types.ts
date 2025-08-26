

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface GeneratedIdea {
    title: string;
    description: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    memberSince: string;
}

export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    date: string;
    productName?: string;
    customerName?: string;
}