export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: 'new' | 'used' | 'refurbished';
  stock: number;
  category: string;
  images: string[];
  created_at: string;
  condition_details?: string;
  original_price?: number;
  warranty_info?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}