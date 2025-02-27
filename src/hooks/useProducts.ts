import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Fetching products...');
        
        // First check if we can access the table at all
        const { data: tableCheck, error: tableError } = await supabase
          .from('products')
          .select('id')
          .limit(1);
          
        console.log('Table check:', { tableCheck, tableError });

        // Then try to get all products with detailed error logging
        const { data, error, status, statusText } = await supabase
          .from('products')
          .select('*');

        console.log('Query response:', {
          status,
          statusText,
          error,
          dataLength: data?.length,
          firstProduct: data?.[0]
        });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No data returned from Supabase');
        }

        console.log('Successfully fetched products:', data);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}