import React, { createContext, useEffect, useState, useContext } from 'react'
import { getDiscountPrice } from '../lib/product-utilities';

export const CartContext = createContext()

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({children}) => {
  const [ cartItems, setCartItems ] = useState([])
  const [ coupon, setCoupon ] = useState(null)
  const [ cartTotal, setCartTotal ] = useState(0.00)
  const [ shouldSave, setShouldSave ] = useState(false)
  const [hasAppliedCoupon, setHasAppliedCoupon] = useState(false);
  const [initialPrice, setInitialPrice] = useState(0)
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const items = localStorage.getItem('cart-items');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, [])

  useEffect(() => {
    if (shouldSave) {
      saveToLocalStorage()
      setShouldSave(false)
    }

    computeTotal()
  }, [cartItems])

  useEffect(() => {
    if(coupon){
      if (hasAppliedCoupon) {
        setCartTotal(Math.round(getDiscountPrice(cartTotal, coupon.discount)))
      }
      else{
        setCartTotal(Math.round(initialPrice))
        setCoupon(null)
      }
    }
  }, [hasAppliedCoupon])

  const computeTotal = () => {
    let total = 0.00
    for (var cartItem of cartItems) {
      if (cartItem.discountedPrice) {
        total += (cartItem.discountedPrice * cartItem.quantity);
      } else {
        total += (cartItem.price * cartItem.quantity);
      }
    }
    setInitialPrice(total)
    if(coupon){
      setCartTotal(getDiscountPrice(total, coupon.discount))
    }
    else{
      setCartTotal(total)
    }

  }

  const setNewCart = (new_cart) => {
    setCartItems(new_cart)
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('cart-items', JSON.stringify(cartItems))
  }

  const addToCart = (item, cartItemId) => {
    setShouldSave(true)
    if (cartItems.length > 0) {
      const sameItem = cartItems.find((i) => i.cartItemId === cartItemId)
      if (sameItem) {
        if (!sameItem.variant || sameItem.variant.name === item.variant.name) {
          sameItem.quantity = sameItem.quantity + 1;
          setCartItems([...cartItems]);
        } else {
          item.cartItemId = cartItemId + item.variant.name;
          setCartItems([...cartItems, item]);
        }
        return
      }
    }

    item.cartItemId = cartItemId

    setCartItems([
      ...cartItems,
      item
    ])
    return
  }

  const clearCart = () => {
    setShouldSave(true)
    setCartItems([])
    setHasAppliedCoupon(false)
  }

  const removeFromCart = (item) => {
    setShouldSave(true)
    if (cartItems.length > 0) {
      let otherItems = cartItems.filter((i) => {
        return i.cartItemId != item.cartItemId
      })
      setCartItems([...otherItems])
    }
  }

  const decreaseQuantity = (item) => {
    setShouldSave(true)
    const isDecrement = true
    const sameItem = cartItems.find((i) => {
      return i.cartItemId == item.cartItemId
    })
    if (sameItem) {
      if (sameItem.quantity > 1) {
        setCartItems([...
          cartItems.map((cartItem) => {
            if (cartItem.cartItemId === item.cartItemId) {
              cartItem.quantity = cartItem.quantity - 1
            }
            return cartItem
          })])
        return isDecrement
      } else {
        removeFromCart(item)
        return !isDecrement
      }
    }
  }

  const resetCart = () => {
    setShouldSave(true)
    setCartItems([])
  }

  return (
  <CartContext.Provider value={{cartItems, addToCart, clearCart,
    removeFromCart, decreaseQuantity, resetCart, coupon, setCoupon, cartTotal,hasAppliedCoupon, setHasAppliedCoupon,couponCode, setCouponCode,setNewCart}}>
    {children}
  </CartContext.Provider>
  )
}
