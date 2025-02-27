import React from 'react';
import { FilterOptions } from '../../hooks/useProductSearch';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  categories
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition
        </label>
        <select
          value={filters.condition || ''}
          onChange={(e) => 
            onFilterChange({ 
              ...filters, 
              condition: (e.target.value as 'new' | 'used' | 'refurbished' | '') || undefined 
            })
          }
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => 
              onFilterChange({ 
                ...filters, 
                minPrice: e.target.value ? Number(e.target.value) : undefined 
              })
            }
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => 
              onFilterChange({ 
                ...filters, 
                maxPrice: e.target.value ? Number(e.target.value) : undefined 
              })
            }
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => onFilterChange({})}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilters; 