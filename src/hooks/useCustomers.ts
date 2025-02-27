import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  created_at: string;
  orders_count: number;
  total_spent: number;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        
        // Fetch customers with their order counts and total spent
        const { data, error: fetchError } = await supabase
          .from('users')
          .select(`
            id,
            email,
            first_name,
            last_name,
            avatar_url,
            created_at,
            orders (
              id,
              total
            )
          `)
          .eq('role', 'customer');

        if (fetchError) throw fetchError;

        const customersWithStats = data.map(customer => ({
          ...customer,
          full_name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          orders_count: customer.orders?.length || 0,
          total_spent: customer.orders?.reduce((sum: number, order: any) => sum + order.total, 0) || 0
        }));

        setCustomers(customersWithStats);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return { customers, loading, error };
} 