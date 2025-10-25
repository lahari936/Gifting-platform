
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <div 
      onClick={() => onProductClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl group"
    >
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-givora-charcoal truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.seller}</p>
        <p className="text-lg font-bold text-givora-pink-dark">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
