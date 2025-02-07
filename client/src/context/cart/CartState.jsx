import React, { useEffect, useState } from 'react'
import CartContext from './CartContext'

const CartState = (props) => {  
    const [ shippingCost, setShippingCost ] = useState(0)
    const [ cartItems, setCartItems ] = useState([])

    const addToCart = (cart) => {
      setCartItems(cart)
      localStorage.setItem("cart", JSON.stringify(cart))
    }

    const removeFromCart = (id) => {
      let filteredCart = cartItems.filter(item => item.id !== id)
      setCartItems(filteredCart)
      localStorage.setItem("cart", JSON.stringify(filteredCart))
    }

    const incQuantity = (id) => {
      let filteredCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1} : item
      )
      setCartItems(filteredCart)
      localStorage.setItem("cart", JSON.stringify(filteredCart))
    }

    const decQuantity = (id) => {
      let filteredCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1} : item
      )
      setCartItems(filteredCart)
      localStorage.setItem("cart", JSON.stringify(filteredCart))
    }

    useEffect(() => {
        setCartItems(JSON.parse(localStorage.getItem("cart")) || [])
    }, [])
  return (
    <CartContext.Provider value={{ cartItems, setCartItems, shippingCost, setShippingCost, addToCart, removeFromCart, incQuantity, decQuantity}}>
        {props.children}
    </CartContext.Provider>
  )
}

export default CartState
