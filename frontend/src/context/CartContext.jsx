import { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export const CartContext = createContext(null)

function getCartKey(user) {
  return user?.id ? `cart_${user.id}` : 'cart_guest'
}

function loadCart(key) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveCart(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

function clearCartKey(key) {
  localStorage.removeItem(key)
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const prevUserRef = useRef(user)

  const [cartItems, setCartItems] = useState(() => {
    return loadCart(getCartKey(user))
  })

  useEffect(() => {
    const prevUser = prevUserRef.current
    const prevKey = getCartKey(prevUser)
    const currentKey = getCartKey(user)

    if (prevKey !== currentKey) {
      const prevCart = loadCart(prevKey)
      const currentCart = loadCart(currentKey)

      if (prevCart.length > 0 && currentCart.length === 0) {
        saveCart(currentKey, prevCart)
        clearCartKey(prevKey)
        setCartItems(prevCart)
      } else if (prevCart.length > 0 && currentCart.length > 0) {
        const merged = [...currentCart]
        for (const item of prevCart) {
          const existing = merged.find((i) => i.id === item.id)
          if (existing) {
            existing.qty = Math.min(existing.qty + item.qty, item.stock)
          } else {
            merged.push(item)
          }
        }
        saveCart(currentKey, merged)
        clearCartKey(prevKey)
        setCartItems(merged)
      } else {
        setCartItems(currentCart)
      }
    }

    prevUserRef.current = user
  }, [user])

  useEffect(() => {
    saveCart(getCartKey(user), cartItems)
  }, [cartItems, user])

  const addToCart = useCallback((product, qty = 1) => {
    const alreadyInCart = cartItems.some((item) => item.id === product.id)
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + qty, product.stock) }
            : item
        )
      }
      return [...prev, { ...product, qty }]
    })
    toast.success(alreadyInCart ? `Updated ${product.name} quantity` : `${product.name} added to cart`)
  }, [cartItems])

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    )
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) toast.success(`${item.name} removed from cart`)
      return prev.filter((item) => item.id !== id)
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}
