import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface OrderStatusCounts {
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}

interface MonthlySale {
  month: string;
  total: number;
}

interface OrderWithUser {
  id: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
  };
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesTrend: number;
  ordersTrend: number;
  customersTrend: number;
  productsTrend: number;
  recentOrders: any[];
  ordersByStatus: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  monthlySales: MonthlySale[];
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesTrend: 0,
    ordersTrend: 0,
    customersTrend: 0,
    productsTrend: 0,
    recentOrders: [],
    ordersByStatus: {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    },
    monthlySales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Get the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch all orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            created_at,
            user_id,
            users (
              first_name,
              last_name
            )
          `)
          .gte('created_at', thirtyDaysAgo.toISOString());

        if (ordersError) throw ordersError;

        const orders = (ordersData || []) as unknown as OrderWithUser[];

        // Fetch total customers
        const { count: customersCount, error: customersError } = await supabase
          .from('users')
          .select('*', { count: 'exact' })
          .eq('role', 'customer');

        if (customersError) throw customersError;

        // Fetch total products
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact' });

        if (productsError) throw productsError;

        // Calculate order statistics
        const orderStatusCounts = orders.reduce((acc: OrderStatusCounts, order) => {
          const status = order.status as OrderStatus;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0
        });

        // Calculate monthly sales
        const monthlySales = orders?.reduce((acc: MonthlySale[], order) => {
          const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(m => m.month === month);
          if (existingMonth) {
            existingMonth.total += order.total;
          } else {
            acc.push({ month, total: order.total });
          }
          return acc;
        }, [] as MonthlySale[]);

        // Calculate total sales and trends
        const totalSales = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        const totalOrders = orders?.length || 0;

        // Calculate trends (comparing to previous period)
        const previousPeriodOrders = orders?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
        }).length || 0;

        const ordersTrend = previousPeriodOrders ? 
          ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100 : 0;

        setStats({
          totalSales,
          totalOrders,
          totalCustomers: customersCount || 0,
          totalProducts: productsCount || 0,
          salesTrend: 12, // You would calculate this based on previous period
          ordersTrend,
          customersTrend: 8,
          productsTrend: -2,
          recentOrders: orders?.slice(0, 10).map(order => ({
            ...order,
            customer_name: order.users ? 
              `${order.users.first_name || ''} ${order.users.last_name || ''}`.trim() : 
              'Unknown'
          })) || [],
          ordersByStatus: orderStatusCounts,
          monthlySales
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return { stats, loading, error };
} 