import { useState, useEffect, useMemo } from 'react';
import { useProducts } from './useProducts';
import { Product } from '../types';

interface FilterOptions {
  category?: string;
  condition?: 'new' | 'used' | 'refurbished';
  minPrice?: number;
  maxPrice?: number;
}

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'name';

export function useProductSearch() {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category));
    return Array.from(uniqueCategories);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }

        // Category filter
        if (filters.category && product.category !== filters.category) {
          return false;
        }

        // Condition filter
        if (filters.condition && product.condition !== filters.condition) {
          return false;
        }

        // Price range filter
        if (filters.minPrice && product.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice && product.price > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, searchQuery, filters, sortBy]);

  return {
    products: filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    categories
  };
} 