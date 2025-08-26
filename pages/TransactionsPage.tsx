import React, { useState, FormEvent, useMemo } from 'react';
import { Transaction } from '../types';
import { ArrowUpCircle, ArrowDownCircle, ShoppingBag, User } from 'lucide-react';
import { useProduct } from '../contexts/ProductContext';
import { useCustomer } from '../contexts/CustomerContext';
import { useTransaction } from '../contexts/TransactionContext';
import Spinner from '../components/Spinner';

const TransactionsPage: React.FC = () => {
    const { products } = useProduct();
    const { customers } = useCustomer();
    const { transactions, addTransaction, loading, error } = useTransaction();
    
    // Form state
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [productId, setProductId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const selectedProduct = useMemo(() => {
        return products.find(p => p.id === parseInt(productId));
    }, [productId, products]);

    const totalAmount = useMemo(() => {
        if (type === 'income' && selectedProduct) {
            return selectedProduct.price * quantity;
        }
        return 0;
    }, [type, selectedProduct, quantity]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let newTransactionData: Omit<Transaction, 'id'>;
        
        if (type === 'income') {
            const product = selectedProduct;
            const customer = customers.find(c => c.id === parseInt(customerId));
            if (!product || !customer) {
                alert('Please select a product and a customer.');
                setIsSubmitting(false);
                return;
            }
            newTransactionData = {
                type,
                description: `Sale of ${quantity} x ${product.name}`,
                amount: totalAmount,
                date,
                productName: product.name,
                customerName: customer.name
            };
        } else {
             const amountValue = (document.getElementById('amount-expense') as HTMLInputElement).value;
            newTransactionData = {
                type,
                description,
                amount: parseFloat(amountValue),
                date,
            };
        }
        
        try {
            await addTransaction(newTransactionData);
            // Reset form
            setDescription('');
            setProductId('');
            setCustomerId('');
            setQuantity(1);
        } catch (err) {
            alert('Failed to add transaction.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
             <h1 className="text-3xl font-bold text-center mb-8">Record a Transaction</h1>
             <div className="grid md:grid-cols-5 gap-8">
                {/* Form Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">New Transaction</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Type</label>
                            <div className="flex gap-4">
                               <label className={`flex-1 p-2 border rounded-lg cursor-pointer text-center ${type === 'income' ? 'bg-green-100 border-green-400' : ''}`} >
                                   <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="sr-only" />
                                   <span>Income</span>
                                </label>
                                <label className={`flex-1 p-2 border rounded-lg cursor-pointer text-center ${type === 'expense' ? 'bg-red-100 border-red-400' : ''}`}>
                                   <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="sr-only" />
                                   <span>Expense</span>
                                </label>
                            </div>
                        </div>

                        {type === 'income' ? (
                            <>
                                <div>
                                    <label htmlFor="product" className="block text-gray-700 font-medium mb-2">Product</label>
                                    <select id="product" value={productId} onChange={e => setProductId(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="" disabled>Select a product</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Quantity</label>
                                    <input type="number" id="quantity" value={quantity} min="1" onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)} required className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label htmlFor="customer" className="block text-gray-700 font-medium mb-2">Customer</label>
                                    <select id="customer" value={customerId} onChange={e => setCustomerId(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="" disabled>Select a customer</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg text-center">
                                    <p className="text-gray-600">Total Price</p>
                                    <p className="text-2xl font-bold text-primary">Rp {totalAmount.toLocaleString('id-ID')}</p>
                                </div>
                            </>
                        ) : (
                             <>
                                <div>
                                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                                    <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label htmlFor="amount-expense" className="block text-gray-700 font-medium mb-2">Amount (Rp)</label>
                                    <input type="number" id="amount-expense" required placeholder="e.g. 50000" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                             </>
                        )}
                         <div>
                            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">
                            {isSubmitting ? 'Adding...' : 'Add Transaction'}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                    {loading && <div className="flex justify-center py-10"><Spinner /></div>}
                    {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
                    {!loading && !error && (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-start p-3 rounded-lg bg-gray-50">
                                <div className="flex items-start gap-3">
                                    {t.type === 'income' 
                                        ? <ArrowUpCircle className="text-green-500 mt-1 flex-shrink-0" />
                                        : <ArrowDownCircle className="text-red-500 mt-1 flex-shrink-0" />
                                    }
                                    <div>
                                        <p className="font-semibold">{t.description}</p>
                                        {t.type === 'income' && t.productName && t.customerName && (
                                             <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                 <div className="flex items-center gap-1.5">
                                                     <ShoppingBag size={12}/> <span>{t.productName}</span>
                                                 </div>
                                                 <div className="flex items-center gap-1.5">
                                                     <User size={12}/> <span>{t.customerName}</span>
                                                 </div>
                                             </div>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">{t.date}</p>
                                    </div>
                                </div>
                                <p className={`font-bold whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

export default TransactionsPage;
