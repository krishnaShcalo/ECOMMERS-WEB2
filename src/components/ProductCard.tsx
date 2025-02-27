import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);

  const conditionColor = {
    new: 'bg-green-100 text-green-800',
    used: 'bg-yellow-100 text-yellow-800',
    refurbished: 'bg-blue-100 text-blue-800',
  }[product.condition];

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow block"
    >
      <div className="aspect-w-1 aspect-h-1 bg-gray-100">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${conditionColor}`}>
            {product.condition}
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        
        <div className="pt-2">
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-primary text-white rounded-lg py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            // Stop event propagation to prevent navigation when clicking the button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;