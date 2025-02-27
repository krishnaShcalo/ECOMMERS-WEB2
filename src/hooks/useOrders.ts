import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface OrderWithUser {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            users (
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setOrders(data?.map(order => ({
          ...order,
          user: order.users
        })) || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return { orders, loading, error };
}