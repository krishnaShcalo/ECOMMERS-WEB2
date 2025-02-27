import React from 'react';
import { Product } from '../../types';

interface ProductListItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="flex items-center p-4 hover:bg-gray-50">
      <div className="flex-shrink-0 h-16 w-16">
        <img
          src={product.images[0] || '/placeholder-product.png'}
          alt={product.name}
          className="h-16 w-16 object-cover rounded-md"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
              style={{
                backgroundColor: product.condition === 'new' ? '#DEF7EC' : 
                              product.condition === 'used' ? '#FDF6B2' : '#E1EFFE',
                color: product.condition === 'new' ? '#03543F' : 
                       product.condition === 'used' ? '#723B13' : '#1E429F'
              }}
            >
              {product.condition}
            </span>
            <span className="text-sm font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate max-w-md">
            {product.description}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem; 