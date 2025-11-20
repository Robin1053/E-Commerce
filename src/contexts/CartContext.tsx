"use client";

import React, { createContext, useContext, useState } from "react";

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = React.useCallback(async () => {
    try {
      // API-Call um die aktuelle Anzahl zu holen
      const response = await fetch("/api/cart/count");
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count || 0);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Warenkorb-Anzahl:", error);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    
    refreshCartCount().then(() => {
      if (!mounted) return;
    }).catch(console.error);
    
    return () => {
      mounted = false;
    };
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart muss innerhalb von CartProvider verwendet werden");
  }
  return context;
}
