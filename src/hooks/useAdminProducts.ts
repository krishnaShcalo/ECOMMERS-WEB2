import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  condition: 'new' | 'used' | 'refurbished';
  stock: number;
  category: string;
  images: string[];
}

export function useAdminProducts() {
  const [loading, setLoading] = useState(true);

  const createProduct = async (product: ProductInput) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<ProductInput>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
  };
} 