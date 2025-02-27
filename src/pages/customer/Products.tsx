import React, { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useSearchParams } from 'react-router-dom';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

const priceRanges = [
  { label: 'Less than $25', min: 0, max: 24.99 },
  { label: '$25 - $49.99', min: 25, max: 49.99 },
  { label: '$50 - $99.99', min: 50, max: 99.99 },
  { label: '$100 - $199.99', min: 100, max: 199.99 },
  { label: '$200 - $499.99', min: 200, max: 499.99 },
  { label: '$500 and Up', min: 500, max: null },
];

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const sortBy = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const category = searchParams.get('category') || '';
  const excludeOutOfStock = searchParams.get('inStock') === 'true';

  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const filteredProducts = products
    .filter(product => {
      const searchLower = searchQuery.toLowerCase();
      if (searchQuery && !product.name.toLowerCase().includes(searchLower) && 
          !product.description.toLowerCase().includes(searchLower)) {
        return false;
      }
      if (excludeOutOfStock && product.stock === 0) return false;
      if (minPrice && product.price < Number(minPrice)) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;
      if (category && product.category !== category) return false;
      return true;
    })
    .sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  // Add console.log to debug
  console.log('Products:', { products, loading, error });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Error Loading Products</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">No Products Found</h2>
        <p className="text-gray-600 mt-2">Check back later for new products.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow p-4 space-y-6">
          <div>
            <h2 className="font-semibold mb-3">Search</h2>
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) {
                    updateFilters({ q: null });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    updateFilters({ q: searchQuery });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg pr-10"
              />
              <button 
                onClick={() => searchQuery && updateFilters({ q: searchQuery })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Get it fast</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={excludeOutOfStock}
                  onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : null })}
                  className="rounded text-primary"
                />
                <span className="text-sm">Exclude Out of Stock Items</span>
              </label>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Price</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="min."
                  value={minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value || null })}
                  className="w-24 px-2 py-1 border rounded"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="max."
                  value={maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value || null })}
                  className="w-24 px-2 py-1 border rounded"
                />
              </div>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => updateFilters({
                      minPrice: range.min.toString(),
                      maxPrice: range.max?.toString() || null
                    })}
                    className={`text-sm w-full text-left hover:text-primary ${
                      minPrice === range.min.toString() ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Category</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateFilters({ category: null })}
                className={`text-sm w-full text-left hover:text-primary ${
                  !category ? 'text-primary font-medium' : 'text-gray-600'
                }`}
              >
                All Products
              </button>
              {['Electronics', 'Clothing', 'Home & Garden'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilters({ category: cat.toLowerCase() })}
                  className={`text-sm w-full text-left hover:text-primary ${
                    category === cat.toLowerCase() ? 'text-primary font-medium' : 'text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              All Products
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProducts.length} items)
              </span>
            </h1>
            <select
              value={sortBy}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;