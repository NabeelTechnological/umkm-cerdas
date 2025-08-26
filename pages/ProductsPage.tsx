import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { useProduct } from '../contexts/ProductContext';
import ProductModal from '../components/ProductModal';
import { PlusCircle } from 'lucide-react';
import Spinner from '../components/Spinner';


const ProductsPage: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, loading, error } = useProduct();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') {
            return products;
        }
        return products.filter(p => p.category === selectedCategory);
    }, [selectedCategory, products]);

    const handleAddClick = () => {
        setModalMode('add');
        setSelectedProduct(null);
        setIsModalOpen(true);
    };
    
    const handleEditClick = (product: Product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
            } catch (err) {
                alert('Failed to delete product.');
            }
        }
    };
    
    const handleSave = async (productData: Omit<Product, 'id'> | Product) => {
        try {
            if (modalMode === 'add') {
                await addProduct(productData as Omit<Product, 'id'>);
            } else {
                await updateProduct(productData as Product);
            }
            setIsModalOpen(false);
        } catch (err) {
             alert(`Failed to ${modalMode} product.`);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-bold">Our Products</h1>
                 <button 
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    <PlusCircle size={18} />
                    <span>Add New Product</span>
                </button>
            </div>
            
            <div className="flex justify-center mb-8 space-x-2 flex-wrap">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 my-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 hover:bg-teal-100'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            {loading && <div className="flex justify-center py-10"><Spinner /></div>}
            {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}


            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                mode={modalMode}
                product={selectedProduct}
            />
        </div>
    );
};

export default ProductsPage;
