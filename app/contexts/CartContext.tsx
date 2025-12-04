'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  nftId: string;
  title: string;
  image: string;
  priceETH: number;
  priceUSD: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (nftId: string) => void;
  updateQuantity: (nftId: string, quantity: number) => void;
  clearCart: () => void;
  totalUSD: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nft-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nft-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.nftId === item.nftId);
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((i) =>
          i.nftId === item.nftId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      // Add new item with quantity 1
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (nftId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.nftId !== nftId));
  };

  const updateQuantity = (nftId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(nftId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.nftId === nftId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalUSD = items.reduce(
    (sum, item) => sum + item.priceUSD * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalUSD,
        itemCount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

