import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Lightbulb, Users, BarChart2, FileText, DollarSign } from 'lucide-react';
import { useProduct } from '../contexts/ProductContext';
import { useCustomer } from '../contexts/CustomerContext';
import { useTransaction } from '../contexts/TransactionContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { products } = useProduct();
    const { customers } = useCustomer();
    const { transactions } = useTransaction();

    const totalProducts = products.length;
    const totalCustomers = customers.length;
    
    const totalSales = useMemo(() => {
        return transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Welcome Header */}
            <section>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Welcome back, <span className="text-primary">{user?.name}!</span>
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Here's a snapshot of your business dashboard.
                </p>
            </section>

            {/* Quick Stats */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-teal-100 p-3 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Products</p>
                        <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                        <BarChart2 className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-800">Rp {totalSales.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ideas Generated</p>
                        <p className="text-2xl font-bold text-gray-800">5+</p>
                    </div>
                </div>
            </section>
            
            {/* Quick Actions */}
            <section>
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/products" className="p-6 bg-white rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center">
                        <ShoppingBag className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
                        <p className="text-gray-600 text-sm">View, add, or edit your product catalog.</p>
                    </Link>
                     <Link to="/customers" className="p-6 bg-white rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center">
                        <Users className="h-12 w-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Manage Customers</h3>
                        <p className="text-gray-600 text-sm">View and manage your customer list.</p>
                    </Link>
                    <Link to="/reports" className="p-6 bg-white rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center">
                        <FileText className="h-12 w-12 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">View Reports</h3>
                        <p className="text-gray-600 text-sm">Check your financial performance.</p>
                    </Link>
                    <Link to="/transactions" className="p-6 bg-white rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center">
                        <DollarSign className="h-12 w-12 text-yellow-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Add Transaction</h3>
                        <p className="text-gray-600 text-sm">Quickly input income or expenses.</p>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;