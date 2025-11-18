"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
  image_url?: string
  weight?: string
  units_per_package?: number
  price?: number // Adicionado: Preço do produto
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number // Adicionado: Obter o preço total do carrinho
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

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        toast.info(`Quantidade de "${item.name}" atualizada no orçamento.`)
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
        )
      } else {
        toast.success(`"${item.name}" adicionado ao orçamento!`)
        return [...prevItems, { ...item, quantity: quantityToAdd }]
      }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === id);
      if (removedItem) {
        toast.info(`"${removedItem.name}" removido do orçamento.`);
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
    // toast.info("Orçamento limpo.") // Removido para evitar toasts duplicados
  }, [])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
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
        getTotalPrice,
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