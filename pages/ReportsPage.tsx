import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTransaction } from '../contexts/TransactionContext';

const ReportsPage: React.FC = () => {
    const { transactions } = useTransaction();

    const { totalIncome, totalExpense, netProfit } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalIncome: income,
            totalExpense: expense,
            netProfit: income - expense,
        };
    }, [transactions]);


    return (
        <div className="animate-fade-in-up space-y-8">
            <h1 className="text-3xl font-bold text-center">Financial Reports</h1>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-gray-800">Rp {totalIncome.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Expense</p>
                        <p className="text-2xl font-bold text-gray-800">Rp {totalExpense.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Net Profit</p>
                        <p className="text-2xl font-bold text-gray-800">Rp {netProfit.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Income vs Expense Trend</h2>
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart will be displayed here.</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;