import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthorizationRules {
  [key: string]: {
    roles: string[];
    permissions?: string[];
  };
}

const rules: AuthorizationRules = {
  viewAdminDashboard: {
    roles: ['admin']
  },
  manageProducts: {
    roles: ['admin']
  },
  manageOrders: {
    roles: ['admin']
  },
  manageUsers: {
    roles: ['admin']
  },
  viewOrders: {
    roles: ['admin', 'customer']
  },
  createOrders: {
    roles: ['customer']
  },
  viewProfile: {
    roles: ['admin', 'customer']
  },
  updateProfile: {
    roles: ['admin', 'customer']
  }
};

export function useAuthorization() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user role:', error);
          return;
        }
        
        setUserRole(data.role);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user?.id]);

  const can = (action: string) => {
    if (loading) return false;
    
    switch (action) {
      case 'viewAdminDashboard':
        return userRole === 'admin';
      case 'viewProfile':
        return !!user;
      case 'manageProducts':
        return userRole === 'admin';
      case 'manageOrders':
        return userRole === 'admin';
      case 'manageUsers':
        return userRole === 'admin';
      default:
        return false;
    }
  };

  const canAny = (actions: string[]): boolean => {
    return actions.some(action => can(action));
  };

  const canAll = (actions: string[]): boolean => {
    return actions.every(action => can(action));
  };

  return {
    can,
    canAny,
    canAll,
    userRole,
    loading
  };
} 