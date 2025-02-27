import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop event propagation to prevent navigation
    addToCart(product);
  };

  const conditionColor = {
    new: 'bg-green-100 text-green-800',
    used: 'bg-yellow-100 text-yellow-800',
    refurbished: 'bg-blue-100 text-blue-800',
  }[product.condition];

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
          <img
            src={product.images[0] || '/images/default-product.png'}
            alt={product.name}
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <button
            className="w-full bg-primary text-white rounded-lg py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;