import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { PostgrestError } from '@supabase/supabase-js';

export interface OrderWithDetails extends Order {
  user: {
    email: string;
  };
  items: {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
}

export function useOrderDetails(orderId?: string) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | Error | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            user:users(email),
            items:order_items(
              id,
              product_id,
              quantity,
              price,
              product:products(name, images)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data as OrderWithDetails);
        setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch order details'));
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  return {
    order,
    loading,
    error: error instanceof Error ? error.message : 'Unknown error',
    isError: error !== null
  };
}