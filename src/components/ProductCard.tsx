import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop event propagation to prevent navigation
    addToCart(product);
  };

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