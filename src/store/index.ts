import { create } from 'zustand';
import { Product } from '../types';

const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const getInitialCart = () => {
  try {
    if (!isStorageAvailable()) return [];
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.warn('Failed to load cart from storage:', error);
    return [];
  }
};

const saveCart = (cart: CartItem[]) => {
  try {
    if (!isStorageAvailable()) return;
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.warn('Failed to save cart to storage:', error);
  }
};

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

interface CartState extends StoreState {
  calculateShipping: (subtotal: number) => number;
  calculateTax: (subtotal: number) => number;
}

export const useStore = create<CartState>((set) => ({
  cart: getInitialCart(),
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      
      let newCart;
      if (existingItem && existingItem.quantity < product.stock) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else if (!existingItem && product.stock > 0) {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      } else {
        return state;
      }
      
      saveCart(newCart);
      return { cart: newCart };
    }),
  removeFromCart: (productId) =>
    set((state: CartState): Partial<CartState> => {
      const newCart = state.cart.filter((item) => item.id !== productId);
      saveCart(newCart);
      return { cart: newCart };
    }),
  updateQuantity: (productId, quantity) =>
    set((state: CartState): Partial<CartState> => {
      if (quantity === 0) {
        const newCart = state.cart.filter((item) => item.id !== productId);
        saveCart(newCart);
        return { cart: newCart };
      }
      
      const product = state.cart.find((item) => item.id === productId);
      if (!product || quantity > product.stock) {
        return { cart: state.cart };
      }
      
      const newCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      saveCart(newCart);
      return { cart: newCart };
    }),
  clearCart: () =>
    set((state: CartState): CartState => ({
      ...state,
      cart: []
    })),
  calculateShipping: (subtotal: number) => {
    // Free shipping over $100
    return subtotal >= 100 ? 0 : 9.99;
  },
  calculateTax: (subtotal: number) => {
    // 8% tax rate
    return subtotal * 0.08;
  },
}));