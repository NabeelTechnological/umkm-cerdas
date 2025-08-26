import React from 'react';
import { Product } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">{product.category}</div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto">
                    <p className="text-xl font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                 <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors">
                    <Edit size={18}/>
                </button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors">
                    <Trash2 size={18}/>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
