"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
  image_url?: string
  weight?: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('doces-sao-fidelis-cart')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('doces-sao-fidelis-cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        toast.info(`Quantidade de "${item.name}" atualizada no carrinho.`)
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        toast.success(`"${item.name}" adicionado ao carrinho!`)
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === id);
      if (removedItem) {
        toast.info(`"${removedItem.name}" removido do carrinho.`);
      }
      return prevItems.filter((item) => item.id !== id);
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== id)
      }
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    toast.info("Carrinho limpo.")
  }, [])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}