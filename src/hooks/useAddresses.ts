import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  is_default: boolean;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    loadAddresses();
  }, [user?.id]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error loading addresses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address: Omit<Address, 'id' | 'user_id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .insert([{ ...address, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setAddresses([...addresses, data]);
      return data;
    } catch (err) {
      console.error('Error adding address:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: string, updates: Partial<Address>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAddresses(addresses.map(addr => addr.id === id ? data : addr));
      return data;
    } catch (err) {
      console.error('Error updating address:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id: string, type: 'shipping' | 'billing') => {
    try {
      setLoading(true);
      // First, remove default status from all addresses of the same type
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id)
        .eq('type', type);

      // Then set the new default address
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadAddresses(); // Reload all addresses to get the updated order
      return data;
    } catch (err) {
      console.error('Error setting default address:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  };
} 