import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Permission = 'viewAdminDashboard' | 'editProducts' | 'manageOrders';

export function useAuthorization() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserRole(data?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  const can = (_permission: Permission): boolean => {
    if (!user || !userRole) return false;
    return userRole === 'admin';
  };

  return { can, loading: loading || authLoading };
} 