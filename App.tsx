
import React from 'react';
import { HashRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AIToolPage from './pages/AIToolPage';
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import TransactionsPage from './pages/TransactionsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { TransactionProvider } from './contexts/TransactionContext';

const ProtectedRoute: React.FC = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <DashboardLayout />;
};

const DashboardLayout: React.FC = () => (
    <div className="flex flex-col min-h-screen bg-base-100 text-content">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <Outlet />
        </main>
        <Footer />
    </div>
);


const App: React.FC = () => {
    return (
        <AuthProvider>
            <ProductProvider>
                <CustomerProvider>
                    <TransactionProvider>
                        <HashRouter>
                            <Routes>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/" element={<ProtectedRoute />}>
                                    <Route index element={<DashboardPage />} />
                                    <Route path="products" element={<ProductsPage />} />
                                    <Route path="customers" element={<CustomersPage />} />
                                    <Route path="reports" element={<ReportsPage />} />
                                    <Route path="transactions" element={<TransactionsPage />} />
                                    <Route path="ai-tool" element={<AIToolPage />} />
                                </Route>
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </HashRouter>
                    </TransactionProvider>
                </CustomerProvider>
            </ProductProvider>
        </AuthProvider>
    );
};

export default App;