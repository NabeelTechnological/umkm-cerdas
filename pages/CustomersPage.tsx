import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useCustomer } from '../contexts/CustomerContext';
import CustomerModal from '../components/CustomerModal';
import Spinner from '../components/Spinner';

const CustomersPage: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer, loading, error } = useCustomer();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, customers]);

    const handleAddClick = () => {
        setModalMode('add');
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };
    
    const handleEditClick = (customer: Customer) => {
        setModalMode('edit');
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (customerId: number) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(customerId);
            } catch (err) {
                alert('Failed to delete customer.');
            }
        }
    };

    const handleSave = async (customerData: Omit<Customer, 'id' | 'memberSince'> | Customer) => {
        try {
            if (modalMode === 'add') {
                await addCustomer(customerData as Omit<Customer, 'id' | 'memberSince'>);
            } else {
                await updateCustomer(customerData as Customer);
            }
            setIsModalOpen(false);
        } catch(err) {
            alert(`Failed to ${modalMode} customer.`);
        }
    };


    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Customer Management</h1>
                <button 
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    <UserPlus size={18} />
                    <span>Add Customer</span>
                </button>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search customers by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {loading && <div className="flex justify-center py-10"><Spinner /></div>}
            {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            {!loading && !error && (
                 <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Member Since</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 whitespace-nowrap font-medium text-gray-800">{customer.name}</td>
                                    <td className="p-4 whitespace-nowrap text-gray-600">{customer.email}</td>
                                    <td className="p-4 whitespace-nowrap text-gray-600">{customer.phone}</td>
                                    <td className="p-4 whitespace-nowrap text-gray-600">{customer.memberSince}</td>
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditClick(customer)} className="text-blue-600 hover:text-blue-800 p-1"><Edit size={18}/></button>
                                            <button onClick={() => handleDeleteClick(customer.id)} className="text-red-600 hover:text-red-800 p-1"><Trash2 size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <CustomerModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                mode={modalMode}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default CustomersPage;
